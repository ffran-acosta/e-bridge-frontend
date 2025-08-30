export interface Patient {
    id: string;
    fullName: string;
    dni: string;
    status: 'ATENCION' | 'INGRESO' | 'ALTA_MEDICA' | 'CIRUGIA';
    lastConsultationDate: string;
    age: number;
    gender: 'FEMENINO' | 'MASCULINO' | 'NO_BINARIO';
    phone: string;
    email: string;
    address: string;
    insuranceName: string;
}

export interface PatientsResponse {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    data: {
        patients: Patient[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface PatientsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
}