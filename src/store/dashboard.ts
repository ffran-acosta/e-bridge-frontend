import { create } from "zustand";
import { useAuthStore } from "./auth";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
    Doctor,
    Admin,
    DashboardStats,
    DashboardResponse,
    BackendDoctor,
    BackendAdmin,
    BackendStats
} from "@/types/dashboard";

type DashboardState = {
    doctors: Doctor[];
    admins: Admin[];
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
};

type DashboardActions = {
    fetchDashboard: () => Promise<void>;
    toggleDoctorStatus: (doctorId: string) => Promise<void>;
    toggleAdminStatus: (adminId: string) => Promise<void>;
    assignDoctorToAdmin: (doctorId: string, adminId: string) => Promise<void>;
    unassignDoctorFromAdmin: (doctorId: string, adminId: string) => Promise<void>;

    // Helpers
    getDoctorById: (doctorId: string) => Doctor | undefined;
    getAdminById: (adminId: string) => Admin | undefined;
    clearError: () => void;
};

export const transformDoctor = (backendDoctor: BackendDoctor): Doctor => ({
    id: backendDoctor.id,
    firstName: backendDoctor.user.firstName,
    lastName: backendDoctor.user.lastName,
    email: backendDoctor.user.email,
    isActive: backendDoctor.user.isActive ?? true,
    licenseNumber: backendDoctor.licenseNumber,
    specialty: {
        id: backendDoctor.specialty.id,
        name: backendDoctor.specialty.name,
    },
    assignedAdminsCount: backendDoctor._count?.adminLinks ?? 0, // ← Opcional con fallback
});
const transformAdmin = (backendAdmin: BackendAdmin): Admin => ({
    id: backendAdmin.id,
    firstName: backendAdmin.user.firstName,
    lastName: backendAdmin.user.lastName,
    email: backendAdmin.user.email,
    isActive: backendAdmin.isActive,
    assignedDoctors: backendAdmin.assignedDoctors.map(doc => doc.id),
    assignedDoctorsCount: backendAdmin._count.doctorLinks,
});

const transformStats = (backendStats: BackendStats): DashboardStats => ({
    activeDoctors: backendStats.activeDoctors,
    activeAdmins: backendStats.activeAdmins,
    totalPatients: backendStats.totalPatients,
    totalAssignments: backendStats.totalAssignments,
});

export const useDashboardStore = create<DashboardState & DashboardActions>((set, get) => ({
    doctors: [],
    admins: [],
    stats: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    // Una sola llamada para traer todo
    fetchDashboard: async () => {
        set({ loading: true, error: null });
        try {
            const { apiWithAuth } = useAuthStore.getState();

            const response = await apiWithAuth<{ data: DashboardResponse }>(ENDPOINTS.superAdmin.dashboard);

            const { stats, doctors, admins } = response.data;

            set({
                stats: transformStats(stats),
                doctors: doctors.map(transformDoctor),
                admins: admins.map(transformAdmin),
            });

        } catch (error: any) {
            set({ error: error.message || 'Error al cargar dashboard' });
        } finally {
            set({ loading: false });
        }
    },

    toggleDoctorStatus: async (doctorId) => {
        console.log('toggleDoctorStatus called with:', doctorId);
        const originalState = get().doctors;

        try {
            const { apiWithAuth } = useAuthStore.getState();
            const doctor = get().doctors.find(d => d.id === doctorId);

            if (!doctor) return;

            // Cambio visual inmediato
            set((state) => {
                const newDoctors = state.doctors.map(d =>
                    d.id === doctorId ? { ...d, isActive: !d.isActive } : d
                );
                return { doctors: newDoctors };
            });

            // Request al backend
            await apiWithAuth(ENDPOINTS.superAdmin.toggleDoctorStatus(doctorId), {
                method: 'PATCH',
                body: { isActive: !doctor.isActive }
            });


        } catch (error: any) {
            console.log('Error occurred, reverting:', error);
            set({
                doctors: originalState,
                error: error.message || 'Error al cambiar estado del médico'
            });
        }
    },

    toggleAdminStatus: async (adminId) => {
        const originalState = get().admins;

        try {
            const { apiWithAuth } = useAuthStore.getState();
            const admin = get().admins.find(a => a.id === adminId);
            if (!admin) return;

            // Cambio visual inmediato
            set((state) => ({
                admins: state.admins.map(a =>
                    a.id === adminId ? { ...a, isActive: !a.isActive } : a
                )
            }));

            // Request al backend
            await apiWithAuth(ENDPOINTS.superAdmin.toggleAdminStatus(adminId), {
                method: 'PATCH',
                body: { isActive: !admin.isActive }
            });

        } catch (error: any) {
            set({
                admins: originalState,
                error: error.message || 'Error al cambiar estado del administrador'
            });
        }
    },

    assignDoctorToAdmin: async (doctorId, adminId) => {
        try {
            const { apiWithAuth } = useAuthStore.getState();

            set((state) => ({
                admins: state.admins.map(admin =>
                    admin.id === adminId
                        ? {
                            ...admin,
                            assignedDoctors: [...admin.assignedDoctors, doctorId],
                            assignedDoctorsCount: admin.assignedDoctorsCount + 1
                        }
                        : admin
                )
            }));

            await apiWithAuth(ENDPOINTS.superAdmin.assignDoctors(adminId), {
                method: 'POST',
                body: { doctorIds: [doctorId] }
            });

        } catch (error: any) {
            // Si falla, revertir cambios
            await get().fetchDashboard();
            set({ error: error.message || 'Error al asignar médico' });
        }
    },

    unassignDoctorFromAdmin: async (doctorId, adminId) => {
        try {
            const { apiWithAuth } = useAuthStore.getState();

            set((state) => ({
                admins: state.admins.map(admin =>
                    admin.id === adminId
                        ? {
                            ...admin,
                            assignedDoctors: admin.assignedDoctors.filter(id => id !== doctorId),
                            assignedDoctorsCount: admin.assignedDoctorsCount - 1
                        }
                        : admin
                )
            }));

            await apiWithAuth(ENDPOINTS.superAdmin.removeDoctorFromAdmin(adminId, doctorId), {
                method: 'DELETE'
            });

        } catch (error: any) {
            // Si falla, revertir cambios
            await get().fetchDashboard();
            set({ error: error.message || 'Error al desasignar médico' });
        }
    },

    getDoctorById: (doctorId) => {
        return get().doctors.find(doctor => doctor.id === doctorId);
    },

    getAdminById: (adminId) => {
        return get().admins.find(admin => admin.id === adminId);
    }
}));