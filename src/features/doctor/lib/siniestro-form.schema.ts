import { z } from 'zod';
import { CreateSiniestroFormData } from '../types/siniestro-form.types';

// Esquema de validación para el formulario de creación de siniestros
export const createSiniestroSchema = z.object({
  patientId: z.string().min(1, 'ID del paciente es requerido'),
  
  artId: z.string()
    .min(1, 'Debe seleccionar una ART'),
    
  medicalEstablishmentId: z.string()
    .min(1, 'Debe seleccionar un establecimiento médico'),
    
  employerId: z.string()
    .min(1, 'Debe seleccionar un empleador'),
    
  contingencyType: z.enum(['ACCIDENTE_TRABAJO', 'ENFERMEDAD_PROFESIONAL', 'ACCIDENTE_IN_ITINERE', 'INTERCURRENCIA'], {
    message: 'Debe seleccionar un tipo de contingencia'
  }),
    
  accidentDateTime: z.string()
    .min(1, 'La fecha y hora del accidente es requerida')
    .refine((dateTime) => {
      const accidentDate = new Date(dateTime);
      const now = new Date();
      // El accidente no puede ser en el futuro
      return accidentDate <= now;
    }, 'La fecha del accidente no puede ser en el futuro'),
});

export type CreateSiniestroFormSchema = z.infer<typeof createSiniestroSchema>;

// Valores por defecto del formulario
export const defaultSiniestroFormValues: Partial<CreateSiniestroFormData> = {
  contingencyType: 'ACCIDENTE_TRABAJO',
};
