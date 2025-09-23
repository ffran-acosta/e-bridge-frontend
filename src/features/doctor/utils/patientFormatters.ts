/**
 * Utilidades para formateo de datos de pacientes
 */

import { PatientProfile } from "@/shared/types/patients.types";

// ========== FUNCIONES BÁSICAS DE PACIENTES ==========

/**
 * Calcular edad desde fecha de nacimiento
 */
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

/**
 * Formatear dirección completa
 */
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

/**
 * Formatear teléfono principal
 */
export const formatPhone = (patient: PatientProfile): string => {
    return patient.phone1 || 'No especificado';
};

/**
 * Obtener nombre completo
 */
export const getFullName = (patient: PatientProfile): string => {
    return `${patient.firstName} ${patient.lastName}`;
};

/**
 * Mapear contacto de emergencia
 */
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

// ========== FUNCIONES DE ESTADO Y TIPOS ==========

/**
 * Helper para obtener variante del badge de estado - Sistema de 4 pasos
 */
export const getStatusBadgeVariant = (status: PatientProfile['currentStatus']) => {
    const variants = {
        'INGRESO': 'step-1',           // PASO 1 - Azul (Inicio)
        'EN_TRATAMIENTO': 'step-3',    // PASO 3 - Naranja (En proceso avanzado)
        'ALTA': 'step-4',              // PASO 4 - Verde (Completado)
        'DERIVADO': 'referred'         // ESPECIAL - Rojo oscuro (Derivado)
    } as const;

    return variants[status] || 'step-1';
};

/**
 * Helper para formatear estado para mostrar
 */
export const formatStatus = (status: PatientProfile['currentStatus']): string => {
    return status.replace('_', ' ');
};

/**
 * Determina si el paciente es ART
 */
export const isARTPatient = (patient: PatientProfile): boolean => {
    return patient.siniestro !== null;
};

/**
 * Formatear tipo de contingencia
 */
export const formatContingencyType = (contingencyType: string): string => {
    const types = {
        'ACCIDENTE_TRABAJO': 'Accidente de Trabajo',
        'ENFERMEDAD_PROFESIONAL': 'Enfermedad Profesional',
        'ACCIDENTE_IN_ITINERE': 'Accidente In Itinere',
        'INTERCURRENCIA': 'Intercurrencia'
    };
    return types[contingencyType as keyof typeof types] || contingencyType;
};

// ========== FUNCIONES DE FORMATEO GENERAL ==========

/**
 * Trunca texto largo para mostrar en cards
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Mapear el perfil completo para el componente
 */
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
