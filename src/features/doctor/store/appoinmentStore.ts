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
    allAppointments: Appointment[]; // Cache de todos los appointments del paciente actual
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
    allAppointments: [],
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
            id: backendAppointment.medicalEstablishment?.id || '',
            name: backendAppointment.medicalEstablishment?.name || 'Establecimiento no especificado',
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

            fetchAppointments: async (patientId: string, page = 1, limit = 5) => {
                const { currentPatientId, loading, allAppointments } = get();

                // Evitar múltiples requests para el mismo paciente
                if (loading && currentPatientId === patientId) return;

                set({ loading: true, error: null, currentPatientId: patientId });

                try {
                    let appointmentsToUse = allAppointments;

                    // Solo hacer fetch si es un paciente diferente o no hay datos en cache
                    if (currentPatientId !== patientId || allAppointments.length === 0) {
                        const response = await api<BackendAppointmentsApiResponse>(
                            `${DOCTOR_ENDPOINTS.patientAppointments(patientId)}`
                        );

                        if (!response) {
                            throw new Error('Sin respuesta del servidor al obtener turnos');
                        }

                        if (response.success) {
                            appointmentsToUse = response.data.data.map(mapBackendAppointmentToFrontend);
                        } else {
                            throw new Error('Error al obtener los turnos');
                        }
                    }

                    // Ordenar por fecha de creación (más recientes primero)
                    const sortedAppointments = appointmentsToUse
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                    // Calcular paginación
                    const total = sortedAppointments.length;
                    const totalPages = Math.ceil(total / limit);
                    
                    // Calcular el offset para la página actual
                    const offset = (page - 1) * limit;
                    const paginatedAppointments = sortedAppointments.slice(offset, offset + limit);

                    const pagination: AppointmentsPagination = {
                        page: page,
                        limit: limit,
                        total: total,
                        totalPages: totalPages,
                    };

                    set({
                        appointments: paginatedAppointments,
                        allAppointments: appointmentsToUse, // Guardar en cache
                        pagination: pagination,
                        loading: false,
                        error: null,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'Error desconocido al cargar los turnos';

                    set({
                        appointments: [],
                        allAppointments: [],
                        pagination: null,
                        loading: false,
                        error: errorMessage,
                    });
                }
            },

            clearAppointments: () => {
                set({
                    appointments: [],
                    allAppointments: [],
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
