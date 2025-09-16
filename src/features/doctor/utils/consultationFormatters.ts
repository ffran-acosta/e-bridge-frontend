/**
 * Utilidades para formateo de consultas
 */

import type { Consultation } from '@/shared/types/patients.types';

/**
 * Obtiene el estado de la consulta basado en appointmentInfo
 */
export const getConsultationStatus = (consultation: Consultation): {
    status: 'completed' | 'pending' | 'scheduled';
    label: string;
    variant: 'default' | 'secondary' | 'outline';
} => {
    const { appointmentInfo, nextAppointmentDate } = consultation;

    if (appointmentInfo.hasNextAppointment && nextAppointmentDate) {
        return {
            status: 'scheduled',
            label: 'Con seguimiento',
            variant: 'outline'
        };
    }

    if (nextAppointmentDate) {
        return {
            status: 'pending',
            label: 'Pendiente seguimiento',
            variant: 'secondary'
        };
    }

    return {
        status: 'completed',
        label: 'Completada',
        variant: 'default'
    };
};

/**
 * Formatea el nombre del doctor con especialidad
 */
export const formatDoctorInfo = (consultation: Consultation): string => {
    const { doctor } = consultation;
    return `${doctor.fullName} - ${doctor.specialtyName} (${doctor.licenseNumber})`;
};

/**
 * Determina si la consulta es un caso ART
 */
export const getArtCaseLabel = (isArtCase: boolean): {
    label: string;
    variant: 'destructive' | 'default';
} => {
    return isArtCase
        ? { label: 'Caso ART', variant: 'destructive' }
        : { label: 'Consulta General', variant: 'default' };
};
