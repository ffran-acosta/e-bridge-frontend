"use client";

import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, JsonValue } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { useDoctorStore } from '../store/doctorStore';
import { 
  atencionConsultationFormSchema, 
  AtencionConsultationFormData,
  defaultAtencionConsultationFormValues 
} from '../lib/atencion-consultation-form.schema';

interface UseCreateAtencionConsultationProps {
  patientId: string;
  onSuccess?: (consultation: unknown) => void;
  onError?: (error: string) => void;
}

export function useCreateAtencionConsultation({
  patientId,
  onSuccess,
  onError,
}: UseCreateAtencionConsultationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AtencionConsultationFormData>({
    resolver: zodResolver(atencionConsultationFormSchema) as Resolver<AtencionConsultationFormData>,
    defaultValues: defaultAtencionConsultationFormValues,
  });

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (data: AtencionConsultationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🎯 Creando consulta de ATENCION:', data);
      
      const endpoint = DOCTOR_ENDPOINTS.patientConsultationAtencion(patientId);
      
      // Convertir fechas de datetime-local a ISO string
      const convertToISO = (dateString: string | undefined) => {
        if (!dateString) return null;
        return new Date(dateString).toISOString();
      };

      const requestBody = {
        medicalEstablishmentId: data.medicalEstablishmentId,
        consultationReason: data.consultationReason,
        diagnosis: data.diagnosis,
        medicalIndications: data.medicalIndications,
        nextAppointmentDate: convertToISO(data.nextAppointmentDate),
        medicalAssistancePlace: data.medicalAssistancePlace,
        medicalAssistanceDate: convertToISO(data.medicalAssistanceDate),
        artDetails: {
          nextRevisionDateTime: convertToISO(data.artDetails.nextRevisionDateTime),
        }
      };

      console.log('📡 Enviando request a:', endpoint);
      console.log('📡 Request body:', requestBody);

      // Si estamos impersonando, enviar el doctorId como header
      const store = useDoctorStore.getState();
      const headers: Record<string, string> = {};
      if (store.isImpersonating && store.impersonatedDoctorId) {
        headers['X-Doctor-Id'] = store.impersonatedDoctorId;
      }

      const response = await api<unknown>(endpoint, {
        method: 'POST',
        body: requestBody as unknown as JsonValue,
        ...(Object.keys(headers).length > 0 ? { headers } : {}),
      });

      if (!response) {
        throw new Error('Sin respuesta del servidor al crear la consulta de atención');
      }

      console.log('✅ Consulta de ATENCION creada exitosamente:', response);
      
      onSuccess?.(response);
      
    } catch (err) {
      console.error('❌ Error al crear consulta de ATENCION:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la consulta de atención';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    error,
    clearError,
  };
}
