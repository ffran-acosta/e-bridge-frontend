import { PatientProfile, BackendPatient, Patient } from "@/shared/types/patients.types";

// Calcular edad desde fecha de nacimiento
export const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

// Formatear dirección completa
export const formatAddress = (patient: PatientProfile): string => {
    const parts = [
        patient.street,
        patient.streetNumber,
        patient.floor && patient.apartment ? `Piso ${patient.floor}, Dto ${patient.apartment}` :
            patient.floor ? `Piso ${patient.floor}` :
                patient.apartment ? `Dto ${patient.apartment}` : null,
        patient.city,
        patient.province,
        patient.postalCode ? `(${patient.postalCode})` : null
    ].filter(Boolean);

    return parts.join(', ');
};

// Mapear contacto de emergencia
export const mapEmergencyContact = (patient: PatientProfile) => {
    if (!patient.emergencyContactName) {
        return {
            name: 'No especificado',
            phone: 'No especificado',
            relationship: 'No especificado'
        };
    }

    return {
        name: patient.emergencyContactName,
        phone: patient.emergencyContactPhone || 'No especificado',
        relationship: patient.emergencyContactRelation || 'No especificado'
    };
};

// Formatear teléfono principal
export const formatPhone = (patient: PatientProfile): string => {
    return patient.phone1 || 'No especificado';
};

// Obtener nombre completo
export const getFullName = (patient: PatientProfile): string => {
    return `${patient.firstName} ${patient.lastName}`;
};

// Mapear el perfil completo para el componente
export const mapPatientForComponent = (patient: PatientProfile) => {
    return {
        // Información básica
        id: patient.id,
        fullName: getFullName(patient),
        firstName: patient.firstName,
        lastName: patient.lastName,
        dni: patient.dni,
        age: calculateAge(patient.birthdate),
        birthdate: patient.birthdate,
        gender: patient.gender,
        currentStatus: patient.currentStatus,

        // Contacto
        phone: formatPhone(patient),
        email: patient.email,
        address: formatAddress(patient),

        // Información médica
        medicalHistory: patient.medicalHistory,
        currentMedications: patient.currentMedications,
        allergies: patient.allergies,

        // Contacto de emergencia
        emergencyContact: mapEmergencyContact(patient),

        // Seguro médico
        insurance: patient.insurance,

        // Estadísticas
        stats: patient.stats,

        // Médicos asignados
        assignedDoctors: patient.assignedDoctors,

        // Última consulta formateada
        lastConsultation: patient.stats.lastConsultationDate
            ? new Date(patient.stats.lastConsultationDate).toLocaleDateString('es-AR')
            : 'Sin consultas',

        // Fechas
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
    };
};

// Helper para obtener variante del badge de estado
export const getStatusBadgeVariant = (status: PatientProfile['currentStatus']) => {
    const variants = {
        'INGRESO': 'default',
        'EN_TRATAMIENTO': 'secondary',
        'ALTA': 'outline',
        'DERIVADO': 'destructive'
    } as const;

    return variants[status] || 'default';
};

// Helper para formatear estado para mostrar
export const formatStatus = (status: PatientProfile['currentStatus']): string => {
    return status.replace('_', ' ');
};

// ========== FUNCIONES PARA FORMATEAR FECHAS ==========

// Formatear fecha y hora completa
export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';

    return new Date(dateString).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Formatear solo fecha
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';

    return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Formatear solo hora
export const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';

    return new Date(dateString).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Formatear última consulta específicamente
export const formatLastConsultation = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Sin consultas';

    return formatDateTime(dateString);
};

export const isARTPatient = (patient: PatientProfile): boolean => {
    return patient.siniestro !== null;
};

// Formatear tipo de contingencia
export const formatContingencyType = (contingencyType: string): string => {
    const types = {
        'ACCIDENTE_TRABAJO': 'Accidente de Trabajo',
        'ENFERMEDAD_PROFESIONAL': 'Enfermedad Profesional',
        'ACCIDENTE_IN_ITINERE': 'Accidente In Itinere',
        'INTERCURRENCIA': 'Intercurrencia'
    };
    return types[contingencyType as keyof typeof types] || contingencyType;
};


// ========== FUNCIONES PARA CONSULTAS ==========

import type { Consultation } from '@/shared/types/patients.types';

/**
 * Formatea la fecha de consulta
 */
export const formatConsultationDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha no válida';
    }
};

/**
 * Formatea la fecha de próxima cita
 */
export const formatNextAppointmentDate = (dateString: string | null): string => {
    if (!dateString) return 'No programada';

    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha no válida';
    }
};

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

/**
 * Trunca texto largo para mostrar en cards
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

// ========== FUNCIONES PARA TURNOS ==========

import type { Appointment } from '@/shared/types/patients.types';

/**
 * Formatea la fecha y hora del turno
 */
export const formatAppointmentDateTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha no válida';
    }
};

/**
 * Formatea solo la fecha del turno
 */
export const formatAppointmentDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return 'Fecha no válida';
    }
};

/**
 * Formatea solo la hora del turno
 */
export const formatAppointmentTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Hora no válida';
    }
};

/**
 * Obtiene el estado del turno con estilo
 */
export const getAppointmentStatus = (appointment: Appointment): {
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
} => {
    const statusMap = {
        'SCHEDULED': {
            status: 'scheduled' as const,
            label: 'Programado',
            variant: 'default' as const
        },
        'COMPLETED': {
            status: 'completed' as const,
            label: 'Completado',
            variant: 'secondary' as const
        },
        'CANCELLED': {
            status: 'cancelled' as const,
            label: 'Cancelado',
            variant: 'destructive' as const
        },
        'NO_SHOW': {
            status: 'no_show' as const,
            label: 'No asistió',
            variant: 'outline' as const
        }
    };

    return statusMap[appointment.status] || statusMap['SCHEDULED'];
};

/**
 * Determina si el turno está próximo (en las próximas 24 horas)
 */
export const isUpcomingAppointment = (appointment: Appointment): boolean => {
    if (appointment.status !== 'SCHEDULED') return false;

    const appointmentDate = new Date(appointment.scheduledDateTime);
    const now = new Date();
    const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDiff > 0 && hoursDiff <= 24;
};

/**
 * Determina si el turno está vencido
 */
export const isOverdueAppointment = (appointment: Appointment): boolean => {
    if (appointment.status !== 'SCHEDULED') return false;

    const appointmentDate = new Date(appointment.scheduledDateTime);
    const now = new Date();

    return appointmentDate < now;
};

/**
 * Obtiene información de seguimiento del turno
 */
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

/**
 * Formatea la información del establecimiento médico
 */
export const formatMedicalEstablishmentInfo = (appointment: Appointment): string => {
    const { medicalEstablishment } = appointment;
    return `${medicalEstablishment.name} (CUIT: ${medicalEstablishment.cuit})`;
};

// ========== MAPPER PARA LISTA DE PACIENTES ==========

/**
 * Transforma un paciente del backend al formato esperado por el frontend
 */
export const mapBackendPatientToFrontend = (backendPatient: BackendPatient): Patient => {
    return {
        id: backendPatient.id,
        fullName: `${backendPatient.firstName} ${backendPatient.lastName}`,
        dni: backendPatient.dni,
        age: backendPatient.age,
        gender: backendPatient.gender,
        phone: backendPatient.phone1,
        email: backendPatient.email,
        address: `${backendPatient.city}, ${backendPatient.province}`,
        status: backendPatient.currentStatus,
        lastConsultationDate: backendPatient.lastConsultationDate || '',
        insuranceName: backendPatient.insurance.name
    };
};