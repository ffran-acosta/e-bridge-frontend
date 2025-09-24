import { z } from 'zod';

// Schema para el formulario de consulta de INGRESO
export const ingresoConsultationFormSchema = z.object({
  // Campos básicos de la consulta
  medicalEstablishmentId: z.string().min(1, 'Debe seleccionar un establecimiento médico'),
  consultationReason: z.string().min(10, 'La razón de consulta debe tener al menos 10 caracteres'),
  diagnosis: z.string().min(5, 'El diagnóstico debe tener al menos 5 caracteres'),
  medicalIndications: z.string().min(10, 'Las indicaciones médicas deben tener al menos 10 caracteres'),
  
  // Fechas
  nextAppointmentDate: z.string().optional(),
  medicalAssistancePlace: z.string().min(1, 'Debe especificar el lugar de asistencia médica'),
  medicalAssistanceDate: z.string().min(1, 'Debe especificar la fecha de asistencia médica'),
  
  // Detalles específicos ART
  artDetails: z.object({
    accidentDateTime: z.string().min(1, 'Debe especificar la fecha y hora del accidente'),
    workAbsenceStartDateTime: z.string().min(1, 'Debe especificar la fecha de inicio de ausencia laboral'),
    firstMedicalAttentionDateTime: z.string().min(1, 'Debe especificar la fecha de primera atención médica'),
    workSickLeave: z.boolean(),
    probableDischargeDate: z.string().optional(),
    nextRevisionDate: z.string().optional(),
    
    // Información del establecimiento del accidente
    accidentEstablishmentName: z.string().min(1, 'Debe especificar el nombre del establecimiento'),
    accidentEstablishmentAddress: z.string().min(1, 'Debe especificar la dirección del establecimiento'),
    accidentEstablishmentPhone: z.string().min(1, 'Debe especificar el teléfono del establecimiento'),
    
    // Contacto del establecimiento
    accidentContactName: z.string().min(1, 'Debe especificar el nombre del contacto'),
    accidentContactCellphone: z.string().min(1, 'Debe especificar el celular del contacto'),
    accidentContactEmail: z.string().email('Debe ser un email válido').optional().or(z.literal('')),
  })
});

export type IngresoConsultationFormData = z.infer<typeof ingresoConsultationFormSchema>;

// Valores por defecto para el formulario
export const defaultIngresoConsultationFormValues: Partial<IngresoConsultationFormData> = {
  consultationReason: '',
  diagnosis: '',
  medicalIndications: '',
  medicalAssistancePlace: '',
  medicalAssistanceDate: '',
  artDetails: {
    accidentDateTime: '',
    workAbsenceStartDateTime: '',
    firstMedicalAttentionDateTime: '',
    workSickLeave: false,
    probableDischargeDate: '',
    nextRevisionDate: '',
    accidentEstablishmentName: '',
    accidentEstablishmentAddress: '',
    accidentEstablishmentPhone: '',
    accidentContactName: '',
    accidentContactCellphone: '',
    accidentContactEmail: '',
  }
};
