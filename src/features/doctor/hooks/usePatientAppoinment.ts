// features/doctor/hooks/usePatientAppointments.ts
import { useEffect, useCallback } from 'react';
import type { Appointment, AppointmentsPagination } from '@/shared/types/patients.types';
import { useAppointmentsStore } from '../store/appoinmentStore';

interface UsePatientAppointmentsReturn {
    appointments: Appointment[];
    pagination: AppointmentsPagination | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    loadPage: (page: number) => void;
}

export const usePatientAppointments = (
    patientId: string | undefined,
    autoFetch = true
): UsePatientAppointmentsReturn => {
    // Usar selectores específicos para evitar re-renders innecesarios
    const appointments = useAppointmentsStore(state => state.appointments);
    const pagination = useAppointmentsStore(state => state.pagination);
    const loading = useAppointmentsStore(state => state.loading);
    const error = useAppointmentsStore(state => state.error);
    const currentPatientId = useAppointmentsStore(state => state.currentPatientId);
    const fetchAppointments = useAppointmentsStore(state => state.fetchAppointments);
    const clearAppointments = useAppointmentsStore(state => state.clearAppointments);

    // Funciones memoizadas
    const refetch = useCallback(() => {
        if (patientId) {
            fetchAppointments(patientId);
        }
    }, [patientId, fetchAppointments]);

    const loadPage = useCallback((page: number) => {
        if (patientId) {
            fetchAppointments(patientId, page);
        }
    }, [patientId, fetchAppointments]);

    // Auto-fetch cuando cambia el patientId
    useEffect(() => {
        if (!patientId || !autoFetch) return;

        // Solo fetch si es un paciente diferente o no hay datos
        if (currentPatientId !== patientId || appointments.length === 0) {
            fetchAppointments(patientId);
        }
    }, [patientId, autoFetch]); // Solo dependemos de patientId y autoFetch

    // Limpiar datos cuando se desmonta o cambia el paciente
    useEffect(() => {
        return () => {
            if (currentPatientId !== patientId) {
                clearAppointments();
            }
        };
    }, [patientId]); // Solo dependemos de patientId

    return {
        appointments,
        pagination,
        loading,
        error,
        refetch,
        loadPage,
    };
};
