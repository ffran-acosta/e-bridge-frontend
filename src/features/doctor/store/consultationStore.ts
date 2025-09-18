// features/doctor/store/consultationsStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
    Consultation,
    ConsultationsResponse,
    ConsultationsApiResponse,
    ConsultationsPagination,
    CreateConsultationDto,
    CreateConsultationResponse,
    BackendConsultationsApiResponse
} from '@/shared/types/patients.types';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { mapBackendConsultationToFrontend } from '../utils/patientMappers';

interface ConsultationsState {
    consultations: Consultation[];
    pagination: ConsultationsPagination | null;
    loading: boolean;
    error: string | null;
    currentPatientId: string | null;
}

interface ConsultationsActions {
    fetchConsultations: (patientId: string, page?: number, limit?: number) => Promise<void>;
    createConsultation: (patientId: string, data: CreateConsultationDto) => Promise<Consultation>;
    clearConsultations: () => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

type ConsultationsStore = ConsultationsState & ConsultationsActions;

const initialState: ConsultationsState = {
    consultations: [],
    pagination: null,
    loading: false,
    error: null,
    currentPatientId: null,
};

export const useConsultationsStore = create<ConsultationsStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            fetchConsultations: async (patientId: string, page = 1, limit = 5) => {
                const { currentPatientId, loading } = get();

                // Evitar múltiples requests para el mismo paciente
                if (loading && currentPatientId === patientId) return;

                set({ loading: true, error: null, currentPatientId: patientId });

                try {
                    const response = await api<BackendConsultationsApiResponse>(
                        `${DOCTOR_ENDPOINTS.consultations}?patientId=${patientId}&page=${page}&limit=${limit}`
                    );

                    // Mapear las consultas del backend al formato del frontend
                    const mappedConsultations = response.data.data.map(mapBackendConsultationToFrontend);

                    // Crear paginación simulada (el backend no devuelve paginación en este endpoint)
                    const pagination: ConsultationsPagination = {
                        page: page,
                        limit: limit,
                        total: mappedConsultations.length,
                        totalPages: Math.ceil(mappedConsultations.length / limit)
                    };

                    set({
                        consultations: mappedConsultations,
                        pagination: pagination,
                        loading: false,
                        error: null,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'Error desconocido al cargar las consultas';

                    set({
                        consultations: [],
                        pagination: null,
                        loading: false,
                        error: errorMessage,
                    });
                }
            },

            createConsultation: async (patientId: string, data: CreateConsultationDto) => {
                set({ loading: true, error: null });

                try {
                    const response = await api<CreateConsultationResponse>(
                        `${DOCTOR_ENDPOINTS.consultations}`,
                        {
                            method: 'POST',
                            body: JSON.stringify(data),
                        }
                    );

                    if (response.data) {
                        const newConsultation = response.data;
                        
                        // Agregar la nueva consulta al estado
                        set((state) => ({
                            consultations: [newConsultation, ...state.consultations],
                            loading: false,
                            error: null,
                        }));

                        return newConsultation;
                    } else {
                        throw new Error('Error al crear la consulta');
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'Error desconocido al crear la consulta';

                    set({
                        loading: false,
                        error: errorMessage,
                    });

                    throw error;
                }
            },

            clearConsultations: () => {
                set({
                    consultations: [],
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
            name: 'consultations-store',
        }
    )
);
