"use client";

import { create } from "zustand";
import { DASHBOARD_ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from "@/features/auth";
import { Doctor, Admin, DashboardStats, BackendDoctor, BackendAdmin, BackendStats, DashboardResponse } from "../types/dashboard";

type DashboardState = {
    doctors: Doctor[];
    admins: Admin[];
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    _lastFetch?: number; // Para evitar múltiples llamadas simultáneas
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
    email: backendDoctor.user.email ?? '',
    isActive: backendDoctor.user.isActive ?? true,
    licenseNumber: backendDoctor.licenseNumber,
    specialty: {
        id: backendDoctor.specialty.id ?? backendDoctor.specialtyId ?? '',
        name: backendDoctor.specialty.name,
    },
    assignedAdminsCount: backendDoctor._count?.adminLinks ?? 0,
});

const transformAdmin = (backendAdmin: BackendAdmin): Admin => ({
    id: backendAdmin.id,
    firstName: backendAdmin.user.firstName,
    lastName: backendAdmin.user.lastName,
    email: backendAdmin.user.email ?? '',
    isActive: backendAdmin.isActive,
    assignedDoctors: backendAdmin.assignedDoctors?.map(doc => doc.id) ?? [],
    assignedDoctorsCount: backendAdmin._count?.doctorLinks ?? 0,
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
    _lastFetch: 0, // Para evitar múltiples llamadas simultáneas

    clearError: () => set({ error: null }),

    fetchDashboard: async () => {
        const currentState = get();
        // Evitar múltiples llamadas simultáneas (dentro de 2 segundos)
        const now = Date.now();
        const lastFetch = currentState._lastFetch || 0;
        if (currentState.loading || (now - lastFetch < 2000)) {
            console.log('⏭️ Saltando llamada duplicada a fetchDashboard');
            return;
        }

        set({ loading: true, error: null, _lastFetch: now });
        try {
            const { apiWithAuth } = useAuthStore.getState();

            console.log('📡 Llamando a:', DASHBOARD_ENDPOINTS.superAdmin.dashboard);
            const response = await apiWithAuth<{ data: DashboardResponse }>(DASHBOARD_ENDPOINTS.superAdmin.dashboard);

            console.log('📥 Respuesta recibida:', response);

            if (!response) {
                throw new Error("Sin respuesta del servidor");
            }

            // Manejar diferentes estructuras de respuesta
            const responseData = response.data || response;
            const { stats, doctors, admins } = responseData;

            if (!stats || !doctors || !admins) {
                console.error('❌ Estructura de respuesta inválida:', responseData);
                throw new Error("Estructura de respuesta inválida del servidor");
            }

            console.log('✅ Datos transformados:', { stats, doctorsCount: doctors.length, adminsCount: admins.length });

            set({
                stats: transformStats(stats),
                doctors: doctors.map(transformDoctor),
                admins: admins.map(transformAdmin),
            });

        } catch (error: unknown) {
            console.error('❌ Error al cargar dashboard:', error);
            const message =
                error instanceof Error
                    ? error.message
                    : "Error al cargar dashboard";
            set({ error: message });
        } finally {
            set({ loading: false });
        }
    },

    toggleDoctorStatus: async (doctorId) => {
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
            await apiWithAuth(DASHBOARD_ENDPOINTS.superAdmin.toggleDoctorStatus(doctorId), {
                method: 'PATCH',
                body: { isActive: !doctor.isActive }
            });


        } catch (error: unknown) {
            console.log('Error occurred, reverting:', error);
            const message =
                error instanceof Error
                    ? error.message
                    : 'Error al cambiar estado del médico';
            set({
                doctors: originalState,
                error: message
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
            await apiWithAuth(DASHBOARD_ENDPOINTS.superAdmin.toggleAdminStatus(adminId), {
                method: 'PATCH',
                body: { isActive: !admin.isActive }
            });

        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Error al cambiar estado del administrador';
            set({
                admins: originalState,
                error: message
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

            await apiWithAuth(DASHBOARD_ENDPOINTS.superAdmin.assignDoctors(adminId), {
                method: 'POST',
                body: { doctorIds: [doctorId] }
            });

        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Error al asignar médico';
            // Si falla, revertir cambios
            await get().fetchDashboard();
            set({ error: message });
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

            await apiWithAuth(DASHBOARD_ENDPOINTS.superAdmin.removeDoctorFromAdmin(adminId, doctorId), {
                method: 'DELETE'
            });

        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Error al desasignar médico';
            // Si falla, revertir cambios
            await get().fetchDashboard();
            set({ error: message });
        }
    },

    getDoctorById: (doctorId) => {
        return get().doctors.find(doctor => doctor.id === doctorId);
    },

    getAdminById: (adminId) => {
        return get().admins.find(admin => admin.id === adminId);
    }
}));