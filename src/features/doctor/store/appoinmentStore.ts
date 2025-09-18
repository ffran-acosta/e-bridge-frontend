import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import type {
    Appointment,
    BackendAppointment,
    BackendAppointmentsApiResponse,
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

// Función para mapear datos del backend al formato del frontend
const mapBackendAppointmentToFrontend = (backendAppointment: BackendAppointment): Appointment => {
    return {
        id: backendAppointment.id,
        scheduledDateTime: backendAppointment.scheduledDateTime,
        status: backendAppointment.status,
        notes: backendAppointment.notes,
        patient: {
            id: backendAppointment.patientId,
            fullName: '', // No viene en la respuesta del backend
            dni: '', // No viene en la respuesta del backend
            age: 0, // No viene en la respuesta del backend
        },
        medicalEstablishment: {
            id: backendAppointment.medicalEstablishment.id,
            name: backendAppointment.medicalEstablishment.name,
            cuit: '', // No viene en la respuesta del backend
        },
        hasOriginConsultation: !!backendAppointment.originMedicalEventId,
        hasCompletedConsultation: !!backendAppointment.completedMedicalEventId,
        createdAt: backendAppointment.createdAt,
        updatedAt: backendAppointment.updatedAt,
    };
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
                    const response = await api<BackendAppointmentsApiResponse>(
                        `${DOCTOR_ENDPOINTS.patientAppointments(patientId)}?page=${page}&limit=${limit}`
                    );

                    if (response.success) {
                        // Mapear los datos del backend al formato del frontend
                        const mappedAppointments = response.data.data.map(mapBackendAppointmentToFrontend);
                        
                        // Crear paginación mock ya que el backend no la devuelve
                        const mockPagination: AppointmentsPagination = {
                            page: page,
                            limit: limit,
                            total: response.data.data.length,
                            totalPages: Math.ceil(response.data.data.length / limit),
                        };

                        set({
                            appointments: mappedAppointments,
                            pagination: mockPagination,
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
