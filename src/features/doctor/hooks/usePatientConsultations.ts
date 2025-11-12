// features/doctor/hooks/usePatientConsultations.ts
import { useEffect } from 'react';
import type { Consultation, ConsultationsPagination } from '@/shared/types/patients.types';
import { useConsultationsStore } from '../store/consultationStore';

interface UsePatientConsultationsReturn {
    consultations: Consultation[];
    pagination: ConsultationsPagination | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    loadPage: (page: number) => void;
}

export const usePatientConsultations = (
    patientId: string | undefined,
    patientType?: 'NORMAL' | 'ART',
    autoFetch = true
): UsePatientConsultationsReturn => {
    const {
        consultations,
        pagination,
        loading,
        error,
        fetchConsultations,
        clearConsultations,
        currentPatientId,
    } = useConsultationsStore();

    // Auto-fetch cuando cambia el patientId
    useEffect(() => {
        if (!patientId || !autoFetch) return;

        // Solo fetch si es un paciente diferente o no hay datos
        if (currentPatientId !== patientId || consultations.length === 0) {
            fetchConsultations(patientId, patientType);
        }
    }, [patientId, patientType, autoFetch, fetchConsultations, currentPatientId, consultations.length]);

    // Limpiar datos cuando se desmonta o cambia el paciente
    useEffect(() => {
        return () => {
            if (currentPatientId !== patientId) {
                clearConsultations();
            }
        };
    }, [patientId, currentPatientId, clearConsultations]);

    const refetch = () => {
        if (patientId) {
            fetchConsultations(patientId, patientType);
        }
    };

    const loadPage = (page: number) => {
        if (patientId) {
            fetchConsultations(patientId, patientType, page);
        }
    };

    return {
        consultations,
        pagination,
        loading,
        error,
        refetch,
        loadPage,
    };
};