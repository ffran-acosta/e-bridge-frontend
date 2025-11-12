// Tipos para el formulario de creación de pacientes

export type PatientType = 'NORMAL' | 'ART';

export type Gender = 'MASCULINO' | 'FEMENINO' | 'NO_BINARIO';

export interface CreatePatientFormData {
  // Campos requeridos
  firstName: string;
  lastName: string;
  dni: string;
  gender: Gender;
  birthdate: string;
  insuranceId: string;
  
  // Campos opcionales con default
  type: PatientType;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  
  // Campos opcionales sin default
  street?: string;
  streetNumber?: string;
  floor?: string;
  apartment?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dni: string;
  gender: Gender;
  birthdate: string;
  insuranceId: string;
  type: PatientType;
  street?: string;
  streetNumber?: string;
  floor?: string;
  apartment?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
}

export interface CreatePatientResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
    data: {
    statusCode: number;
    message: string;
    data: {
      id: string;
      firstName: string;
      lastName: string;
      dni: string;
      type: PatientType;
      gender: Gender;
      birthdate: string;
      currentStatus: string;
      street?: string;
      streetNumber?: string;
      floor?: string;
      apartment?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      phone1?: string;
      phone2?: string;
      email?: string;
      allergies: string[];
      currentMedications: string[];
      emergencyContactName?: string;
      emergencyContactPhone?: string;
      emergencyContactRelation?: string;
      medicalHistory: string[];
      insurance: {
        id: string;
        name: string;
        planName: string;
        isActive: boolean;
      };
      assignedDoctors: Array<{
        id: string;
        assignedAt: string;
        isActive: boolean;
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
        lastConsultationDate: string | null;
        nextAppointmentDate: string | null;
      };
      createdAt: string;
      updatedAt: string;
      siniestro?: unknown;
    };
  };
}

// Opciones para los selects
export interface SelectOption {
  value: string;
  label: string;
}

export const GENDER_OPTIONS: SelectOption[] = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'NO_BINARIO', label: 'No binario' }
];

export const PATIENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'NORMAL', label: 'Normal (Obra Social)' },
  { value: 'ART', label: 'ART (Aseguradora de Riesgos del Trabajo)' }
];

// Tipos para los catálogos
export interface Insurance {
  id: string;
  code: string;
  name: string;
  planName: string;
  contactInfo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InsuranceResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: Insurance[];
    meta: InsuranceMeta;
  };
}
