import { PatientProfile } from "@/shared/types/patients.types";

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