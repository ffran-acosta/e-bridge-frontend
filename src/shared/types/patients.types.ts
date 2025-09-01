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

// Para el perfil extendido
export interface PatientProfile extends Patient {
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalHistory: string[];
    currentMedications: string[];
    allergies: string[];
}

// Para respuestas de API
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