"use client";

import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, JsonValue } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { 
  altaConsultationFormSchema, 
  AltaConsultationFormData,
  defaultAltaConsultationFormValues 
} from '../lib/alta-consultation-form.schema';

interface UseCreateAltaConsultationProps {
  patientId: string;
  patientName: string;
  onSuccess?: (consultation: any) => void;
  onError?: (error: string) => void;
}

export function useCreateAltaConsultation({
  patientId,
  patientName,
  onSuccess,
  onError,
}: UseCreateAltaConsultationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AltaConsultationFormData>({
    resolver: zodResolver(altaConsultationFormSchema) as Resolver<AltaConsultationFormData>,
    defaultValues: defaultAltaConsultationFormValues,
  });

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (data: AltaConsultationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🎯 Creando consulta de ALTA:', data);
      
      const endpoint = DOCTOR_ENDPOINTS.patientConsultationAlta(patientId);
      
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
        medicalAssistancePlace: data.medicalAssistancePlace,
        medicalAssistanceDate: convertToISO(data.medicalAssistanceDate),
        artDetails: {
          pendingMedicalTreatment: data.artDetails.pendingMedicalTreatment,
          pendingTreatmentTypes: data.artDetails.pendingTreatmentTypes,
          professionalRequalification: data.artDetails.professionalRequalification,
          treatmentEndDateTime: convertToISO(data.artDetails.treatmentEndDateTime),
          itlCeaseReason: data.artDetails.itlCeaseReason,
          derivationReason: data.artDetails.derivationReason,
          inculpableAffection: data.artDetails.inculpableAffection,
          disablingSequelae: data.artDetails.disablingSequelae,
          maintenanceBenefits: data.artDetails.maintenanceBenefits,
          psychologicalTreatment: data.artDetails.psychologicalTreatment,
          sequelaeEstimationRequired: data.artDetails.sequelaeEstimationRequired,
          finalTreatmentEndDateTime: convertToISO(data.artDetails.finalTreatmentEndDateTime),
          finalDisablingSequelae: data.artDetails.finalDisablingSequelae,
          finalProfessionalRequalification: data.artDetails.finalProfessionalRequalification,
          finalMaintenanceBenefits: data.artDetails.finalMaintenanceBenefits,
          finalPsychologicalTreatment: data.artDetails.finalPsychologicalTreatment,
          finalSequelaeEstimationRequired: data.artDetails.finalSequelaeEstimationRequired,
        }
      };

      console.log('📡 Enviando request a:', endpoint);
      console.log('📡 Request body:', requestBody);

      const response = await api<unknown>(endpoint, {
        method: 'POST',
        body: requestBody as unknown as JsonValue,
      });

      if (!response) {
        throw new Error('Sin respuesta del servidor al crear la consulta de alta');
      }

      console.log('✅ Consulta de ALTA creada exitosamente:', response);
      
      onSuccess?.(response);
      
    } catch (err) {
      console.error('❌ Error al crear consulta de ALTA:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la consulta de alta';
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
