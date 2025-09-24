import { z } from 'zod';
import { CreatePatientFormData } from '../types/patient-form.types';

// Esquema de validación para el formulario de edición de pacientes
export const editPatientSchema = z.object({
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
    
  type: z.enum(['NORMAL', 'ART']),
  
  currentStatus: z.enum(['INGRESO', 'ATENCION', 'CIRUGIA', 'ALTA_MEDICA']),
  
  // Campos opcionales
  street: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'La calle debe tener al menos 2 caracteres'),
    
  streetNumber: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), 'El número debe contener solo dígitos'),
    
  city: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'La ciudad debe tener al menos 2 caracteres'),
    
  phone1: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val), 'Formato de teléfono inválido'),
    
  email: z.string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'Formato de email inválido'),
    
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
});

export type EditPatientFormSchema = z.infer<typeof editPatientSchema>;

// Tipo para la petición de edición (basado en el body que proporcionaste)
export interface EditPatientRequest {
  firstName: string;
  lastName: string;
  dni: string;
  gender: 'MASCULINO' | 'FEMENINO' | 'NO_BINARIO';
  birthdate: string;
  type: 'NORMAL' | 'ART';
  currentStatus: 'INGRESO' | 'ATENCION' | 'CIRUGIA' | 'ALTA_MEDICA';
  street?: string;
  streetNumber?: string;
  city?: string;
  phone1?: string;
  email?: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
}
