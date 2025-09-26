import { z } from 'zod';

export const appointmentFormSchema = z.object({
  // Campos obligatorios según el backend
  patientId: z.string().min(1, 'El ID del paciente es requerido'),
  doctorId: z.string().min(1, 'El ID del doctor es requerido'),
  appointmentDate: z.string().min(1, 'La fecha del turno es requerida'),
  appointmentTime: z.string().min(1, 'La hora del turno es requerida'),
  
  // Campos opcionales
  notes: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

// Función para obtener la fecha actual en formato datetime-local
export const getCurrentDateLocal = () => {
  const now = new Date();
  // Ajustar por la zona horaria local
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10); // Solo la fecha (YYYY-MM-DD)
};

// Función para obtener la hora actual en formato HH:MM
export const getCurrentTimeLocal = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // HH:MM
};

// Valores por defecto
export const getAppointmentDefaultValues = (patientId: string, doctorId: string): Partial<AppointmentFormData> => ({
  patientId,
  doctorId,
  appointmentDate: getCurrentDateLocal(),
  appointmentTime: getCurrentTimeLocal(),
});

// Opciones de tipo de turno
export const appointmentTypes = [
  { value: 'CONSULTA', label: 'Consulta Médica' },
  { value: 'CONTROL', label: 'Control de Seguimiento' },
  { value: 'URGENCIA', label: 'Urgencia Médica' },
  { value: 'CIRUGIA', label: 'Cirugía Programada' },
] as const;

// Opciones de estado del turno
export const appointmentStatuses = [
  { value: 'SCHEDULED', label: 'Programado' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'COMPLETED', label: 'Completado' },
] as const;

// Opciones de duración (en minutos)
export const durationOptions = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1.5 horas' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
  { value: 240, label: '4 horas' },
] as const;
