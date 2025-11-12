"use client";

import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, JsonValue } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { 
  ingresoConsultationFormSchema, 
  IngresoConsultationFormData,
  defaultIngresoConsultationFormValues 
} from '../lib/ingreso-consultation-form.schema';

interface UseCreateIngresoConsultationProps {
  patientId: string;
  patientName: string;
  siniestroData?: any; // Datos del siniestro para pre-llenar campos
  onSuccess?: (consultation: any) => void;
  onError?: (error: string) => void;
}

export function useCreateIngresoConsultation({
  patientId,
  patientName,
  siniestroData,
  onSuccess,
  onError,
}: UseCreateIngresoConsultationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar valores por defecto basados en el siniestro
  const getDefaultValues = (): Partial<IngresoConsultationFormData> => {
    const defaults: Partial<IngresoConsultationFormData> = {
      ...defaultIngresoConsultationFormValues,
    };
    
    if (siniestroData) {
      const accidentDateTime =
        typeof siniestroData.accidentDateTime === 'string'
          ? siniestroData.accidentDateTime
          : '';
      const employerName =
        typeof siniestroData.employer?.name === 'string'
          ? siniestroData.employer.name
          : '';

      // Pre-llenar campos con datos del siniestro
      defaults.artDetails = {
        ...(defaultIngresoConsultationFormValues.artDetails ?? {}),
        accidentDateTime,
        accidentEstablishmentName: employerName,
        accidentEstablishmentAddress: '', // No viene en siniestro
        accidentEstablishmentPhone: '', // No viene en siniestro
        accidentContactName: '', // No viene en siniestro
        accidentContactCellphone: '', // No viene en siniestro
        accidentContactEmail: '', // No viene en siniestro
      } as IngresoConsultationFormData['artDetails'];
    }
    
    return defaults;
  };

  const form = useForm<IngresoConsultationFormData>({
    resolver: zodResolver(ingresoConsultationFormSchema) as Resolver<IngresoConsultationFormData>,
    defaultValues: getDefaultValues(),
  });

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (data: IngresoConsultationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🎯 Creando consulta de INGRESO:', data);
      
      const endpoint = DOCTOR_ENDPOINTS.patientConsultationIngreso(patientId);
      
      const requestBody = {
        medicalEstablishmentId: data.medicalEstablishmentId,
        consultationReason: data.consultationReason,
        diagnosis: data.diagnosis,
        medicalIndications: data.medicalIndications,
        nextAppointmentDate: data.nextAppointmentDate || null,
        medicalAssistancePlace: data.medicalAssistancePlace,
        medicalAssistanceDate: data.medicalAssistanceDate,
        artDetails: {
          accidentDateTime: data.artDetails.accidentDateTime,
          workAbsenceStartDateTime: data.artDetails.workAbsenceStartDateTime,
          firstMedicalAttentionDateTime: data.artDetails.firstMedicalAttentionDateTime,
          workSickLeave: data.artDetails.workSickLeave,
          probableDischargeDate: data.artDetails.probableDischargeDate || null,
          nextRevisionDate: data.artDetails.nextRevisionDate || null,
          accidentEstablishmentName: data.artDetails.accidentEstablishmentName,
          accidentEstablishmentAddress: data.artDetails.accidentEstablishmentAddress,
          accidentEstablishmentPhone: data.artDetails.accidentEstablishmentPhone,
          accidentContactName: data.artDetails.accidentContactName,
          accidentContactCellphone: data.artDetails.accidentContactCellphone,
          accidentContactEmail: data.artDetails.accidentContactEmail || null,
        }
      };

      console.log('📡 Enviando request a:', endpoint);
      console.log('📡 Request body:', requestBody);
      console.log('📡 Request body stringified:', JSON.stringify(requestBody));

      const response = await api<unknown>(endpoint, {
        method: 'POST',
        body: requestBody as unknown as JsonValue,
      });

      if (!response) {
        throw new Error('Sin respuesta del servidor al crear la consulta de ingreso');
      }

      console.log('✅ Consulta de INGRESO creada exitosamente:', response);
      
      onSuccess?.(response);
      
    } catch (err) {
      console.error('❌ Error al crear consulta de INGRESO:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la consulta de ingreso';
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
