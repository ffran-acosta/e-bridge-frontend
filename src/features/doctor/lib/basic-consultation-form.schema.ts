import { z } from 'zod';

const CONSULTATION_TYPE_VALUES = ['INGRESO', 'ATENCION', 'ALTA'] as const;

export const basicConsultationFormSchema = z.object({
  // Campos obligatorios según el backend
  medicalEstablishmentId: z.string().min(1, 'El establecimiento médico es requerido'),
  type: z.enum(CONSULTATION_TYPE_VALUES),
  consultationReason: z.string().min(1, 'El motivo de consulta es requerido'),
  diagnosis: z.string().min(1, 'El diagnóstico es requerido'),
  medicalIndications: z.string().min(1, 'Las indicaciones médicas son requeridas'),
  
  // Campos opcionales
  nextAppointmentDate: z.string().optional(),
  medicalAssistancePlace: z.string().optional(),
  medicalAssistanceDate: z.string().optional(),
});

export type BasicConsultationFormData = z.infer<typeof basicConsultationFormSchema>;

// Función para obtener la fecha y hora actual en formato datetime-local
export const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Valores por defecto
export const getBasicConsultationDefaultValues = (): Partial<BasicConsultationFormData> => ({
  type: 'ATENCION',
  medicalAssistanceDate: getCurrentDateTimeLocal(),
});

// Opciones de tipo de consulta
export const consultationTypes = [
  { value: 'INGRESO', label: 'Ingreso' },
  { value: 'ATENCION', label: 'Atención' },
  { value: 'ALTA', label: 'Alta' },
] as const;
