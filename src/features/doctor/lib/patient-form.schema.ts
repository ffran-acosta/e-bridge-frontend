import { z } from 'zod';
import { CreatePatientFormData } from '../types/patient-form.types';

// Esquema de validación para el formulario de creación de pacientes
export const createPatientSchema = z.object({
  // Campos requeridos
  firstName: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    
  lastName: z.string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
    
  dni: z.string()
    .min(1, 'El DNI es requerido')
    .regex(/^\d{7,8}$/, 'El DNI debe tener entre 7 y 8 dígitos'),
    
  gender: z.enum(['MASCULINO', 'FEMENINO', 'NO_BINARIO'], {
    message: 'Debe seleccionar un género'
  }),
    
  birthdate: z.string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Fecha de nacimiento inválida'),
    
  insuranceId: z.string()
    .min(1, 'Debe seleccionar una obra social'),

  // Campos opcionales con default
  type: z.enum(['NORMAL', 'ART']).default('NORMAL'),
  
  medicalHistory: z.array(z.string())
    .default([])
    .refine((arr) => arr.length === 0 || arr.every(item => item.trim().length > 0), 
      'Los elementos del historial médico no pueden estar vacíos'),
    
  currentMedications: z.array(z.string())
    .default([])
    .refine((arr) => arr.length === 0 || arr.every(item => item.trim().length > 0), 
      'Los medicamentos no pueden estar vacíos'),
    
  allergies: z.array(z.string())
    .default([])
    .refine((arr) => arr.length === 0 || arr.every(item => item.trim().length > 0), 
      'Las alergias no pueden estar vacías'),

  // Campos opcionales sin default
  street: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'La calle debe tener al menos 2 caracteres'),
    
  streetNumber: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), 'El número debe contener solo dígitos'),
    
  floor: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), 'El piso debe contener solo dígitos'),
    
  apartment: z.string()
    .optional()
    .refine((val) => !val || val.length <= 10, 'El departamento no puede exceder 10 caracteres'),
    
  city: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'La ciudad debe tener al menos 2 caracteres'),
    
  province: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'La provincia debe tener al menos 2 caracteres'),
    
  postalCode: z.string()
    .optional()
    .refine((val) => !val || /^\d{4,8}$/.test(val), 'El código postal debe tener entre 4 y 8 dígitos'),
    
  phone1: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val), 'Formato de teléfono inválido'),
    
  phone2: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val), 'Formato de teléfono inválido'),
    
  email: z.string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'Formato de email inválido'),
    
  emergencyContactName: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'El nombre del contacto debe tener al menos 2 caracteres'),
    
  emergencyContactPhone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val), 'Formato de teléfono inválido'),
    
  emergencyContactRelation: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'La relación debe tener al menos 2 caracteres'),
});

export type CreatePatientFormSchema = z.infer<typeof createPatientSchema>;

// Valores por defecto del formulario
export const defaultFormValues: Partial<CreatePatientFormData> = {
  type: 'NORMAL',
  medicalHistory: [],
  currentMedications: [],
  allergies: [],
};
