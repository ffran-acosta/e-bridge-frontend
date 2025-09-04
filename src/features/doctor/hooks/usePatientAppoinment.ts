// features/doctor/hooks/usePatientAppointments.ts
import { useEffect } from 'react';
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
    const {
        appointments,
        pagination,
        loading,
        error,
        fetchAppointments,
        clearAppointments,
        currentPatientId,
    } = useAppointmentsStore();

    // Auto-fetch cuando cambia el patientId
    useEffect(() => {
        if (!patientId || !autoFetch) return;

        // Solo fetch si es un paciente diferente o no hay datos
        if (currentPatientId !== patientId || appointments.length === 0) {
            fetchAppointments(patientId);
        }
    }, [patientId, autoFetch, fetchAppointments, currentPatientId, appointments.length]);

    // Limpiar datos cuando se desmonta o cambia el paciente
    useEffect(() => {
        return () => {
            if (currentPatientId !== patientId) {
                clearAppointments();
            }
        };
    }, [patientId, currentPatientId, clearAppointments]);

    const refetch = () => {
        if (patientId) {
            fetchAppointments(patientId);
        }
    };

    const loadPage = (page: number) => {
        if (patientId) {
            fetchAppointments(patientId, page);
        }
    };

    return {
        appointments,
        pagination,
        loading,
        error,
        refetch,
        loadPage,
    };
};
