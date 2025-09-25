import { z } from 'zod';

export const atencionConsultationFormSchema = z.object({
  medicalEstablishmentId: z.string().uuid({ message: 'Establecimiento médico es requerido' }),
  consultationReason: z.string().min(1, 'Motivo de consulta es requerido'),
  diagnosis: z.string().min(1, 'Diagnóstico es requerido'),
  medicalIndications: z.string().min(1, 'Indicaciones médicas son requeridas'),
  nextAppointmentDate: z.string().optional(),
  medicalAssistancePlace: z.string().min(1, 'Lugar de asistencia médica es requerido'),
  medicalAssistanceDate: z.string().min(1, 'Fecha de asistencia médica es requerida'),
  artDetails: z.object({
    nextRevisionDateTime: z.string().optional(),
  }),
});

export type AtencionConsultationFormData = z.infer<typeof atencionConsultationFormSchema>;

// Función para obtener la fecha actual en formato datetime-local
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  // Ajustar por la zona horaria local
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDateTime.toISOString().slice(0, 16);
};

export const defaultAtencionConsultationFormValues: Partial<AtencionConsultationFormData> = {
  medicalEstablishmentId: '',
  consultationReason: '',
  diagnosis: '',
  medicalIndications: '',
  nextAppointmentDate: '',
  medicalAssistancePlace: '',
  medicalAssistanceDate: getCurrentDateTimeLocal(),
  artDetails: {
    nextRevisionDateTime: '',
  },
};
