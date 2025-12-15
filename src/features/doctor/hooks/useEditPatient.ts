"use client";

import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, JsonValue } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { useDoctorStore } from '../store/doctorStore';
import {
  editPatientFormSchema,
  EditPatientFormData,
  defaultEditPatientFormValues,
} from '../lib/edit-patient-form.schema';
import type { PatientProfile, PatientProfileResponse } from '@/shared/types/patients.types';

// Función para mapear datos del paciente al formulario
const mapPatientDataToForm = (patientData?: Partial<PatientProfile> | null): Partial<EditPatientFormData> => {
  if (!patientData) return defaultEditPatientFormValues;

  // Convertir fecha ISO a formato date-local
  const formatDateForInput = (isoDate?: string | null) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().slice(0, 10);
  };

  const normalizeCurrentStatus = (
    status?: PatientProfile['currentStatus']
  ): EditPatientFormData['currentStatus'] => {
    switch (status) {
      case 'INGRESO':
      case 'ALTA':
        return status;
      case 'EN_TRATAMIENTO':
        return 'ATENCION';
      case 'DERIVADO':
        return 'REINGRESO';
      default:
        return 'INGRESO';
    }
  };

  return {
    firstName: patientData.firstName || '',
    lastName: patientData.lastName || '',
    dni: patientData.dni || '',
    gender: patientData.gender || 'MASCULINO',
    birthdate: formatDateForInput(patientData.birthdate),
    insuranceId: patientData.insurance?.id || '',
    type: patientData.type || 'NORMAL',
    currentStatus: normalizeCurrentStatus(patientData.currentStatus),
    street: patientData.street || '',
    streetNumber: patientData.streetNumber || '',
    floor: patientData.floor || '',
    apartment: patientData.apartment || '',
    city: patientData.city || '',
    province: patientData.province || '',
    postalCode: patientData.postalCode || '',
    phone1: patientData.phone1 || '',
    phone2: patientData.phone2 || '',
    email: patientData.email || '',
    emergencyContactName: patientData.emergencyContactName || '',
    emergencyContactPhone: patientData.emergencyContactPhone || '',
    emergencyContactRelation: patientData.emergencyContactRelation || '',
    medicalHistory: patientData.medicalHistory ?? [],
    currentMedications: patientData.currentMedications ?? [],
    allergies: patientData.allergies ?? [],
  };
};

interface UseEditPatientProps {
  patientId: string;
  patientData?: Partial<PatientProfile> | null; // Datos del paciente para precargar el formulario
  onSuccess?: (patient: PatientProfileResponse) => void;
  onError?: (error: string) => void;
}

export function useEditPatient({
  patientId,
  patientData,
  onSuccess,
  onError,
}: UseEditPatientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditPatientFormData>({
    resolver: zodResolver(editPatientFormSchema) as Resolver<EditPatientFormData>,
    defaultValues: mapPatientDataToForm(patientData),
  });

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (data: EditPatientFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🎯 Editando paciente:', data);
      
            const endpoint = DOCTOR_ENDPOINTS.patientProfile(patientId);
      
      // Convertir fecha de date-local a ISO string
      const convertToISO = (dateString: string) => {
        if (!dateString) return null;
        return new Date(dateString).toISOString();
      };

      const requestBody = {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        gender: data.gender,
        birthdate: convertToISO(data.birthdate),
        insuranceId: data.insuranceId,
        type: data.type,
        currentStatus: data.currentStatus,
        street: data.street,
        streetNumber: data.streetNumber,
        floor: data.floor || '',
        apartment: data.apartment || '',
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        phone1: data.phone1,
        phone2: data.phone2 || '',
        email: data.email || '',
        emergencyContactName: data.emergencyContactName || '',
        emergencyContactPhone: data.emergencyContactPhone || '',
        emergencyContactRelation: data.emergencyContactRelation || '',
        medicalHistory: data.medicalHistory,
        currentMedications: data.currentMedications,
        allergies: data.allergies,
      };

      console.log('📡 Enviando request a:', endpoint);
      console.log('📡 Request body:', requestBody);

      // Si estamos impersonando, enviar el doctorId como header
      const store = useDoctorStore.getState();
      const headers: Record<string, string> = {};
      if (store.isImpersonating && store.impersonatedDoctorId) {
        headers['X-Doctor-Id'] = store.impersonatedDoctorId;
      }

      const response = await api<PatientProfileResponse>(endpoint, {
        method: 'PATCH',
        body: requestBody as unknown as JsonValue,
        ...(Object.keys(headers).length > 0 ? { headers } : {}),
      });

      if (!response) {
        throw new Error('Sin respuesta del servidor al editar el paciente');
      }

      console.log('✅ Paciente editado exitosamente:', response);
      
      onSuccess?.(response);
      
    } catch (err) {
      console.error('❌ Error al editar paciente:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al editar el paciente';
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