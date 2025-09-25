import { z } from 'zod';

// Opciones de género
export const GENDERS = [
  { value: "FEMENINO", label: "Femenino" },
  { value: "MASCULINO", label: "Masculino" },
  { value: "NO_BINARIO", label: "No Binario" }
] as const;

// Opciones de tipo de paciente
export const PATIENT_TYPES = [
  { value: "NORMAL", label: "Normal" },
  { value: "ART", label: "ART" }
] as const;

// Opciones de estado actual
export const CURRENT_STATUS_OPTIONS = [
  { value: "INGRESO", label: "Ingreso" },
  { value: "ATENCION", label: "Atención" },
  { value: "ALTA", label: "Alta" },
  { value: "REINGRESO", label: "Reingreso" }
] as const;

export const editPatientFormSchema = z.object({
  firstName: z.string().min(1, 'Nombre es requerido'),
  lastName: z.string().min(1, 'Apellido es requerido'),
  dni: z.string().min(7, 'DNI debe tener al menos 7 caracteres').max(8, 'DNI debe tener máximo 8 caracteres'),
  gender: z.enum(["FEMENINO", "MASCULINO", "NO_BINARIO"]),
  birthdate: z.string().min(1, 'Fecha de nacimiento es requerida'),
  insuranceId: z.string().uuid({ message: 'Obra social es requerida' }),
  type: z.enum(["NORMAL", "ART"]),
  currentStatus: z.enum(["INGRESO", "ATENCION", "ALTA", "REINGRESO"]),
  street: z.string().min(1, 'Calle es requerida'),
  streetNumber: z.string().min(1, 'Número de calle es requerido'),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().min(1, 'Ciudad es requerida'),
  province: z.string().min(1, 'Provincia es requerida'),
  postalCode: z.string().min(1, 'Código postal es requerido'),
  phone1: z.string().min(1, 'Teléfono principal es requerido'),
  phone2: z.string().optional(),
  email: z.string().email('Email debe ser válido').optional().or(z.literal('')),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  medicalHistory: z.array(z.string()).default([]),
  currentMedications: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
});

export type EditPatientFormData = z.infer<typeof editPatientFormSchema>;

// Función para obtener la fecha actual en formato date-local
const getCurrentDateLocal = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

export const defaultEditPatientFormValues: Partial<EditPatientFormData> = {
  firstName: '',
  lastName: '',
  dni: '',
  gender: 'MASCULINO',
  birthdate: '',
  insuranceId: '',
  type: 'NORMAL',
  currentStatus: 'INGRESO',
  street: '',
  streetNumber: '',
  floor: '',
  apartment: '',
  city: '',
  province: '',
  postalCode: '',
  phone1: '',
  phone2: '',
  email: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  medicalHistory: [],
  currentMedications: [],
  allergies: [],
};