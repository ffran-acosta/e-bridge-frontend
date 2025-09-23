// Tipos para el formulario de creación de siniestros

export type ContingencyType = 'ACCIDENTE_TRABAJO' | 'ENFERMEDAD_PROFESIONAL' | 'ACCIDENTE_IN_ITINERE' | 'INTERCURRENCIA';

export interface CreateSiniestroFormData {
  patientId: string;
  artId: string;
  medicalEstablishmentId: string;
  employerId: string;
  contingencyType: ContingencyType;
  accidentDateTime: string;
}

export interface CreateSiniestroRequest {
  patientId: string;
  artId: string;
  medicalEstablishmentId: string;
  employerId: string;
  contingencyType: ContingencyType;
  accidentDateTime: string;
}

export interface CreateSiniestroResponse {
  id: string;
  patientId: string;
  artId: string;
  contingencyType: ContingencyType;
  accidentDateTime: string;
  createdAt: string;
}

// Opciones para los selects
export interface SelectOption {
  value: string;
  label: string;
}

export const CONTINGENCY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'ACCIDENTE_TRABAJO', label: 'Accidente de Trabajo' },
  { value: 'ENFERMEDAD_PROFESIONAL', label: 'Enfermedad Profesional' },
  { value: 'ACCIDENTE_IN_ITINERE', label: 'Accidente In Itínere' },
  { value: 'INTERCURRENCIA', label: 'Intercurrencia' }
];

// Tipos para los catálogos
export interface ART {
  id: string;
  name: string;
  code?: string;
}

export interface MedicalEstablishment {
  id: string;
  name: string;
  cuit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employer {
  id: string;
  name: string;
  cuit?: string;
}

export interface ARTResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: ART[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface MedicalEstablishmentResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: MedicalEstablishment[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface EmployerResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: Employer[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
