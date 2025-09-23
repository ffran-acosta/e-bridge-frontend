// Utilidades para formateo de turnos/appointments

import type { Appointment } from '@/shared/types/patients.types';

// Obtiene el estado del turno con estilo - Sistema de 4 pasos
export const getAppointmentStatus = (appointment: Appointment): {
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    label: string;
    variant: 'step-1' | 'step-4' | 'cancelled' | 'no-show';
} => {
    const statusMap = {
        'SCHEDULED': {
            status: 'scheduled' as const,
            label: 'Programado',
            variant: 'step-1' as const
        },
        'COMPLETED': {
            status: 'completed' as const,
            label: 'Completado',
            variant: 'step-4' as const
        },
        'CANCELLED': {
            status: 'cancelled' as const,
            label: 'Cancelado',
            variant: 'cancelled' as const
        },
        'NO_SHOW': {
            status: 'no_show' as const,
            label: 'No asistió',
            variant: 'no-show' as const
        }
    };

    return statusMap[appointment.status] || statusMap['SCHEDULED'];
};

// Determina si el turno está próximo (en las próximas 24 horas)
export const isUpcomingAppointment = (appointment: Appointment): boolean => {
    if (appointment.status !== 'SCHEDULED') return false;

    const appointmentDate = new Date(appointment.scheduledDateTime);
    const now = new Date();
    const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDiff > 0 && hoursDiff <= 24;
};

// Determina si el turno está vencido
export const isOverdueAppointment = (appointment: Appointment): boolean => {
    if (appointment.status !== 'SCHEDULED') return false;

    const appointmentDate = new Date(appointment.scheduledDateTime);
    const now = new Date();

    return appointmentDate < now;
};

// Obtiene información de seguimiento del turno
export const getAppointmentFollowUp = (appointment: Appointment): {
    hasOrigin: boolean;
    hasCompletion: boolean;
    status: string;
} => {
    const { hasOriginConsultation, hasCompletedConsultation } = appointment;

    let status = 'Sin seguimiento';

    if (hasOriginConsultation && hasCompletedConsultation) {
        status = 'Seguimiento completo';
    } else if (hasOriginConsultation) {
        status = 'Con consulta origen';
    } else if (hasCompletedConsultation) {
        status = 'Con consulta completada';
    }

    return {
        hasOrigin: hasOriginConsultation,
        hasCompletion: hasCompletedConsultation,
        status
    };
};

// Formatea la información del establecimiento médico
export const formatMedicalEstablishmentInfo = (appointment: Appointment): string => {
    const { medicalEstablishment } = appointment;
    // Si no hay CUIT, solo mostrar el nombre
    if (!medicalEstablishment.cuit) {
        return medicalEstablishment.name;
    }
    return `${medicalEstablishment.name} (CUIT: ${medicalEstablishment.cuit})`;
};
