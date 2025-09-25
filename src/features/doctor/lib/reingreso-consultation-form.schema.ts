import { z } from 'zod';

// Opciones para reingreso aceptado
export const READMISSION_ACCEPTED_OPTIONS = [
  { value: true, label: "Sí - Aceptado" },
  { value: false, label: "No - Denegado" }
] as const;

// Razones de denegación de reingreso
export const READMISSION_DENIAL_REASONS = [
  { value: "NO_REQUIERE_REINGRESO", label: "No requiere reingreso" },
  { value: "TRATAMIENTO_AMBULATORIO", label: "Tratamiento ambulatorio suficiente" },
  { value: "FALTA_DOCUMENTACION", label: "Falta documentación médica" },
  { value: "NO_CORRESPONDE_ART", label: "No corresponde cobertura ART" },
  { value: "OTRO", label: "Otra razón" }
] as const;

export const reingresoConsultationFormSchema = z.object({
  medicalEstablishmentId: z.string().uuid({ message: 'Establecimiento médico es requerido' }),
  consultationReason: z.string().min(1, 'Motivo de consulta es requerido'),
  diagnosis: z.string().min(1, 'Diagnóstico es requerido'),
  medicalIndications: z.string().min(1, 'Indicaciones médicas son requeridas'),
  nextAppointmentDate: z.string().optional(),
  medicalAssistancePlace: z.string().min(1, 'Lugar de asistencia médica es requerido'),
  medicalAssistanceDate: z.string().min(1, 'Fecha de asistencia médica es requerida'),
  artDetails: z.object({
    // Fechas importantes del reingreso
    originalContingencyDate: z.string().min(1, 'Fecha de contingencia original es requerida'),
    previousDischargeDate: z.string().min(1, 'Fecha de alta anterior es requerida'),
    readmissionRequestDate: z.string().min(1, 'Fecha de solicitud de reingreso es requerida'),
    
    // Estado del reingreso
    readmissionAccepted: z.boolean().default(true),
    readmissionDenialReason: z.string().optional(),
  }),
});

export type ReingresoConsultationFormData = z.infer<typeof reingresoConsultationFormSchema>;

// Función para obtener la fecha actual en formato datetime-local
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  // Ajustar por la zona horaria local
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDateTime.toISOString().slice(0, 16);
};

export const defaultReingresoConsultationFormValues: Partial<ReingresoConsultationFormData> = {
  medicalEstablishmentId: '',
  consultationReason: '',
  diagnosis: '',
  medicalIndications: '',
  nextAppointmentDate: '',
  medicalAssistancePlace: '',
  medicalAssistanceDate: getCurrentDateTimeLocal(),
  artDetails: {
    originalContingencyDate: '',
    previousDischargeDate: '',
    readmissionRequestDate: getCurrentDateTimeLocal(),
    readmissionAccepted: true,
    readmissionDenialReason: '',
  },
};
