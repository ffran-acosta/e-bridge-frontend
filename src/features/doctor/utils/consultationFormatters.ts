/**
 * Utilidades para formateo de consultas
 */

import type { Consultation } from '@/shared/types/patients.types';

/**
 * Obtiene el estado de la consulta basado en appointmentInfo - Sistema de 4 pasos
 */
export const getConsultationStatus = (consultation: Consultation): {
    status: 'completed' | 'pending' | 'scheduled';
    label: string;
    variant: 'step-1' | 'step-2' | 'step-3' | 'step-4';
} => {
    const { appointmentInfo, nextAppointmentDate } = consultation;

    if (appointmentInfo.hasNextAppointment && nextAppointmentDate) {
        return {
            status: 'scheduled',
            label: 'Con seguimiento',
            variant: 'step-2'        // PASO 2 - Amarillo (En proceso)
        };
    }

    if (nextAppointmentDate) {
        return {
            status: 'pending',
            label: 'Pendiente seguimiento',
            variant: 'step-3'        // PASO 3 - Naranja (Casi listo)
        };
    }

    return {
        status: 'completed',
        label: 'Completada',
        variant: 'step-4'            // PASO 4 - Verde (Completado)
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
 * Determina si la consulta es un caso ART - Sistema de 4 pasos
 */
export const getArtCaseLabel = (isArtCase: boolean): {
    label: string;
    variant: 'surgery' | 'step-1';
} => {
    return isArtCase
        ? { label: 'Caso ART', variant: 'surgery' }      // ESPECIAL - Púrpura (ART)
        : { label: 'Consulta General', variant: 'step-1' }; // PASO 1 - Azul (General)
};
