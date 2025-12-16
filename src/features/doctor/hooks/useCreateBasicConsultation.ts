import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { useDoctorStore } from '../store/doctorStore';
import type { BasicConsultationFormData } from '../lib/basic-consultation-form.schema';

interface UseCreateBasicConsultationOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useCreateBasicConsultation({
  onSuccess,
  onError,
}: UseCreateBasicConsultationOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isImpersonating, impersonatedDoctorId } = useDoctorStore();

  const createBasicConsultation = useCallback(async (
    patientId: string,
    data: BasicConsultationFormData
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🎯 Creando consulta básica para paciente:', patientId);

      const endpoint = DOCTOR_ENDPOINTS.patientBasicConsultation;

      // Convertir datetime-local a ISO para el backend
      const convertToISO = (datetimeLocal: string) => {
        return new Date(datetimeLocal).toISOString();
      };

      const requestBody = {
        patientId: patientId,
        medicalEstablishmentId: data.medicalEstablishmentId,
        type: data.type,
        consultationReason: data.consultationReason,
        diagnosis: data.diagnosis,
        medicalIndications: data.medicalIndications,
        nextAppointmentDate: data.nextAppointmentDate ? convertToISO(data.nextAppointmentDate) : undefined,
        medicalAssistancePlace: data.medicalAssistancePlace || undefined,
        medicalAssistanceDate: data.medicalAssistanceDate ? convertToISO(data.medicalAssistanceDate) : undefined,
      };

      console.log('📡 Enviando POST a:', endpoint);
      console.log('📡 Request body:', requestBody);
      console.log('📡 URL completa:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`);

      // Si estamos impersonando, enviar el doctorId como header
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (isImpersonating && impersonatedDoctorId) {
        headers['X-Doctor-Id'] = impersonatedDoctorId;
      }

      await api(endpoint, {
        method: 'POST',
        headers,
        body: requestBody,
      });

      console.log('✅ Consulta básica creada exitosamente');
      onSuccess?.();

    } catch (err) {
      console.error('❌ Error al crear consulta básica:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear consulta básica';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const clearError = useCallback(() => setError(null), []);

  return {
    createBasicConsultation,
    isLoading,
    error,
    clearError,
  };
}
