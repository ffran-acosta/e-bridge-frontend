import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import type {
    Appointment,
    AppointmentsApiResponse,
    AppointmentsPagination
} from '@/shared/types/patients.types';

interface AppointmentsState {
    appointments: Appointment[];
    pagination: AppointmentsPagination | null;
    loading: boolean;
    error: string | null;
    currentPatientId: string | null;
}

interface AppointmentsActions {
    fetchAppointments: (patientId: string, page?: number, limit?: number) => Promise<void>;
    clearAppointments: () => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

type AppointmentsStore = AppointmentsState & AppointmentsActions;

const initialState: AppointmentsState = {
    appointments: [],
    pagination: null,
    loading: false,
    error: null,
    currentPatientId: null,
};

export const useAppointmentsStore = create<AppointmentsStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            fetchAppointments: async (patientId: string, page = 1, limit = 20) => {
                const { currentPatientId, loading } = get();

                // Evitar múltiples requests para el mismo paciente
                if (loading && currentPatientId === patientId) return;

                set({ loading: true, error: null, currentPatientId: patientId });

                try {
                    const response = await api<AppointmentsApiResponse>(
                        `${DOCTOR_ENDPOINTS.patientAppointments(patientId)}?page=${page}&limit=${limit}`
                    );

                    if (response.success) {
                        set({
                            appointments: response.data.appointments,
                            pagination: response.data.pagination,
                            loading: false,
                            error: null,
                        });
                    } else {
                        throw new Error('Error al obtener los turnos');
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'Error desconocido al cargar los turnos';

                    set({
                        appointments: [],
                        pagination: null,
                        loading: false,
                        error: errorMessage,
                    });
                }
            },

            clearAppointments: () => {
                set({
                    appointments: [],
                    pagination: null,
                    currentPatientId: null,
                });
            },

            setError: (error: string | null) => {
                set({ error });
            },

            reset: () => {
                set(initialState);
            },
        }),
        {
            name: 'appointments-store',
        }
    )
);
