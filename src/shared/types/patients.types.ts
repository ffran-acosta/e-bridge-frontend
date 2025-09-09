// En @/shared/types/patients.types.ts

export interface Patient {
    id: string;
    fullName: string;
    dni: string;
    age: number;
    gender: 'FEMENINO' | 'MASCULINO' | 'NO_BINARIO';
    phone: string;
    email: string;
    address: string;
    status: 'ATENCION' | 'INGRESO' | 'ALTA_MEDICA' | 'CIRUGIA';
    lastConsultationDate: string;
    insuranceName: string;
}

export interface PatientsResponse {
    patients: Patient[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface PatientsParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortBy?: string;
}

export interface PatientProfile {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    gender: 'FEMENINO' | 'MASCULINO' | 'NO_BINARIO';
    birthdate: string;
    currentStatus: 'INGRESO' | 'EN_TRATAMIENTO' | 'ALTA' | 'DERIVADO';
    street: string;
    streetNumber: string;
    floor?: string | null;
    apartment?: string | null;
    city: string;
    province: string;
    postalCode: string;
    phone1: string;
    phone2?: string | null;
    email: string;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    medicalHistory: string[];
    currentMedications: string[];
    allergies: string[];
    insurance: {
        id: string;
        code: string;
        name: string;
        planName: string;
        contactInfo?: string | null;
        isActive: boolean;
    };
    siniestro: Siniestro | null
    assignedDoctors: Array<{
        id: string;
        assignedAt: string;
        isActive: boolean;
        notes: string;
        doctor: {
            id: string;
            licenseNumber: string;
            user: {
                firstName: string;
                lastName: string;
            };
            specialty: {
                name: string;
            };
        };
    }>;
    stats: {
        totalConsultations: number;
        totalAppointments: number;
        lastConsultationDate?: string | null;
        nextAppointmentDate?: string | null;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PatientProfileResponse {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    data: PatientProfile;
}

export interface Siniestro {
    id: string;
    contingencyType: 'ACCIDENTE_TRABAJO' | 'ENFERMEDAD_PROFESIONAL' | 'ACCIDENTE_IN_ITINERE' | 'INTERCURRENCIA';
    accidentDateTime: string;
    art: {
        id: string;
        name: string;
        code: string;
    };
    medicalEstablishment: {
        id: string;
        name: string;
        cuit: string;
    };
    employer: {
        id: string;
        name: string;
        cuit: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface MedicalEstablishment {
    id: string;
    name: string;
}

export interface DoctorInfo {
    id: string;
    fullName: string;
    licenseNumber: string;
    specialtyName: string;
}

export interface EmployerInfo {
    id: string;
    name: string;
}

export interface AppointmentInfo {
    hasOriginAppointment: boolean;
    hasNextAppointment: boolean;
    nextAppointmentId: string | null;
}

export interface Consultation {
    id: string;
    consultationReason: string;
    diagnosis: string;
    nextAppointmentDate: string | null;
    isArtCase: boolean;
    medicalEstablishment: MedicalEstablishment;
    employer: EmployerInfo | null;
    doctor: DoctorInfo;
    appointmentInfo: AppointmentInfo;
    createdAt: string;
    updatedAt: string;
}

export interface ConsultationsPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ConsultationsResponse {
    consultations: Consultation[];
    pagination: ConsultationsPagination;
}

export interface ConsultationsApiResponse {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    data: ConsultationsResponse;
}

// ========== TIPOS PARA TURNOS ==========

export interface PatientInfo {
    id: string;
    fullName: string;
    dni: string;
    age: number;
}

export interface MedicalEstablishmentInfo {
    id: string;
    name: string;
    cuit: string;
}

export interface Appointment {
    id: string;
    scheduledDateTime: string;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    notes: string;
    patient: PatientInfo;
    medicalEstablishment: MedicalEstablishmentInfo;
    hasOriginConsultation: boolean;
    hasCompletedConsultation: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AppointmentsPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AppointmentsResponse {
    appointments: Appointment[];
    pagination: AppointmentsPagination;
}

export interface AppointmentsApiResponse {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    data: AppointmentsResponse;
}

// ========== TIPOS PARA CREAR CONSULTAS ==========

export interface CreateConsultationFormData {
    consultationReason: string;
    diagnosis: string;
    medicalIndications: string;
    medicalEstablishmentId: string;
    isArtCase: boolean;
    employerId?: string;
    nextAppointmentDate?: string;
    fromAppointmentId?: string;
}

export interface CreateConsultationDto {
    consultationReason: string;
    diagnosis: string;
    medicalIndications: string;
    medicalEstablishmentId: string;
    employerId?: string;
    nextAppointmentDate?: string;
    fromAppointmentId?: string;
}

export interface CreateConsultationResponse {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    data: Consultation;
}