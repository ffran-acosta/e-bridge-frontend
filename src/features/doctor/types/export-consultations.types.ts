// Tipos para las consultas de exportación

export type ConsultationType = 'INGRESO' | 'ATENCION' | 'ALTA' | 'REINGRESO';
export type PatientType = 'ART' | 'NORMAL';

export interface ExportConsultation {
    id: string;
    type: ConsultationType;
    patientFullName: string;
    date: string; // ISO string
    patientType: PatientType;
}

export interface ExportConsultationsPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface ExportConsultationsResponse {
    statusCode: number;
    data: ExportConsultation[];
    pagination: ExportConsultationsPagination;
}

export interface ExportConsultationsParams {
    page?: number;
    limit?: number;
    patientType?: PatientType;
    type?: ConsultationType;
    startDate?: string; // ISO string
    endDate?: string; // ISO string
    search?: string;
    patientId?: string;
}
