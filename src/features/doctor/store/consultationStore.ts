// features/doctor/store/consultationsStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
    Consultation,
    ConsultationsPagination,
    CreateConsultationDto,
    CreateConsultationResponse,
    BackendConsultationsApiResponse
} from '@/shared/types/patients.types';
import { api, JsonValue } from '@/lib/api';
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
    fetchConsultations: (patientId: string, patientType?: 'NORMAL' | 'ART', page?: number, limit?: number) => Promise<void>;
    createConsultation: (patientId: string, data: CreateConsultationDto) => Promise<Consultation>;
    deleteConsultation: (consultationId: string) => Promise<void>;
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

            fetchConsultations: async (patientId: string, patientType?: 'NORMAL' | 'ART', page = 1, limit = 5) => {
                const { currentPatientId, loading } = get();

                // Evitar múltiples requests para el mismo paciente
                if (loading && currentPatientId === patientId) return;

                set({ loading: true, error: null, currentPatientId: patientId });

                try {
                    const endpoint = DOCTOR_ENDPOINTS.patientConsultations(patientId);
                    
                    const response = await api<BackendConsultationsApiResponse>(endpoint);

                    if (!response || !response.data) {
                        throw new Error('Sin respuesta del servidor al obtener consultas');
                    }

                    // Mapear las consultas del backend al formato del frontend
                    const mappedConsultations = response.data.data.map(consultation => 
                        mapBackendConsultationToFrontend(consultation, patientType)
                    );
                    
                    // Verificar si las consultas pertenecen realmente al paciente
                    const patientIdsInConsultations = mappedConsultations.map(c => c.patientId);
                    const uniquePatientIds = [...new Set(patientIdsInConsultations)];
                    
                    // Solo validar si hay consultas
                    if (mappedConsultations.length > 0) {
                        if (uniquePatientIds.length > 1 || !uniquePatientIds.includes(patientId)) {
                            console.error('❌ PROBLEMA DETECTADO: Las consultas no pertenecen al paciente correcto!');
                            console.error('❌ Patient ID esperado:', patientId);
                            console.error('❌ Patient IDs en consultas:', uniquePatientIds);
                        }
                    }

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
                    // Determinar el endpoint basado en el tipo de consulta ART
                    const consultationType = data.type || 'INGRESO';
                    let targetPath: string;

                    if (!data.patientId && data.medicalEstablishmentId && data.artDetails) {
                        // Es una consulta ART específica
                        switch (consultationType.toUpperCase()) {
                            case 'INGRESO':
                                targetPath = DOCTOR_ENDPOINTS.patientConsultationIngreso(patientId);
                                break;
                            case 'ATENCION':
                                targetPath = DOCTOR_ENDPOINTS.patientConsultationAtencion(patientId);
                                break;
                            case 'ALTA':
                                targetPath = DOCTOR_ENDPOINTS.patientConsultationAlta(patientId);
                                break;
                            default:
                                targetPath = `${DOCTOR_ENDPOINTS.consultations}`;
                        }
                    } else {
                        // Consulta genérica
                        targetPath = `${DOCTOR_ENDPOINTS.consultations}`;
                    }

                    console.log('🔍 Endpoint seleccionado:', targetPath);
                    console.log('🔍 Tipo de consulta:', consultationType);

                    const response = await api<CreateConsultationResponse>(targetPath, {
                        method: 'POST',
                        body: data as unknown as JsonValue,
                    });

                    if (!response) {
                        throw new Error('Sin respuesta del servidor al crear la consulta');
                    }

                    if (response.data) {
                        console.log('📦 Respuesta completa del backend al crear consulta:', response);
                        console.log('📦 response.data:', response.data);
                        
                        // Normalizar al formato frontend por si el backend devuelve forma cruda
                        const newConsultation = mapBackendConsultationToFrontend(response.data, 'ART'); // Por defecto ART para consultas creadas
                        
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

            deleteConsultation: async (consultationId: string) => {
                set({ loading: true, error: null });

                try {
                    console.log('🗑️ Eliminando consulta:', consultationId);
                    
                    await api(DOCTOR_ENDPOINTS.deleteConsultation(consultationId), {
                        method: 'DELETE',
                    });

                    // Remover la consulta del estado local
                    set((state) => ({
                        consultations: state.consultations.filter(c => c.id !== consultationId),
                        loading: false,
                        error: null,
                    }));

                    console.log('✅ Consulta eliminada exitosamente');
                } catch (error) {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'Error desconocido al eliminar la consulta';

                    set({
                        loading: false,
                        error: errorMessage,
                    });

                    console.error('❌ Error al eliminar consulta:', error);
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
