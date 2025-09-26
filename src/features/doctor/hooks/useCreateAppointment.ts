import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { 
  appointmentFormSchema, 
  getAppointmentDefaultValues, 
  type AppointmentFormData 
} from '../lib/appointment-form.schema';

interface UseCreateAppointmentProps {
  onSuccess?: (appointment: any) => void;
  onError?: (error: string) => void;
}

export function useCreateAppointment({
  onSuccess,
  onError,
}: UseCreateAppointmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getAppointmentDefaultValues('', ''), // Se actualizará cuando se use
  });

  const createAppointment = async (data: AppointmentFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🎯 Creando turno:', data);

      const endpoint = DOCTOR_ENDPOINTS.appointments;

      // Convertir fecha y hora a formato ISO para el backend
      const convertToISO = (date: string, time: string) => {
        const dateTime = new Date(`${date}T${time}:00`);
        return dateTime.toISOString();
      };

      const requestBody = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        scheduledDateTime: convertToISO(data.appointmentDate, data.appointmentTime),
        notes: data.notes || undefined,
      };

      console.log('📡 Enviando POST a:', endpoint);
      console.log('📡 Request body:', requestBody);
      console.log('📡 URL completa:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`);

      const response = await api(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      console.log('✅ Turno creado exitosamente:', response);
      onSuccess?.(response);
    } catch (err) {
      console.error('❌ Error al crear turno:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el turno';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    createAppointment,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
