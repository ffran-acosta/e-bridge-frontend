import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { 
  editPatientSchema, 
  type EditPatientFormSchema,
  type EditPatientRequest 
} from '../lib/edit-patient-form.schema';
import { PatientProfile } from '@/shared/types/patients.types';

interface UseEditPatientOptions {
  patientId: string;
  patientData?: PatientProfile;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useEditPatient(options: UseEditPatientOptions) {
  const { patientId, patientData, onSuccess, onError } = options;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para mapear los datos del paciente al formato del formulario
  const mapPatientToFormData = (patient: PatientProfile): Partial<EditPatientFormSchema> => {
    // Mapear el estado actual a los valores que espera el backend
    const mapCurrentStatus = (status: string) => {
      switch (status) {
        case 'INGRESO':
          return 'INGRESO';
        case 'EN_TRATAMIENTO':
          return 'ATENCION';
        case 'ALTA':
          return 'ALTA_MEDICA';
        case 'DERIVADO':
          return 'INGRESO'; // Mapear DERIVADO a INGRESO como fallback
        default:
          return 'INGRESO';
      }
    };

    return {
      firstName: patient.firstName,
      lastName: patient.lastName,
      dni: patient.dni,
      gender: patient.gender, // Ya está en el formato correcto
      birthdate: patient.birthdate,
      type: patient.siniestro ? 'ART' : 'NORMAL',
      currentStatus: mapCurrentStatus(patient.currentStatus),
      street: patient.street || '',
      streetNumber: patient.streetNumber || '',
      city: patient.city || '',
      phone1: patient.phone1 || '',
      email: patient.email || '',
      medicalHistory: patient.medicalHistory || [],
      currentMedications: patient.currentMedications || [],
      allergies: patient.allergies || [],
    };
  };

  const form = useForm<EditPatientFormSchema>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dni: '',
      gender: 'MASCULINO',
      birthdate: '',
      type: 'NORMAL',
      currentStatus: 'INGRESO',
      street: '',
      streetNumber: '',
      city: '',
      phone1: '',
      email: '',
      medicalHistory: [],
      currentMedications: [],
      allergies: [],
    },
    mode: 'onChange',
  });

  // Cargar datos del paciente cuando estén disponibles
  useEffect(() => {
    if (patientData) {
      const formData = mapPatientToFormData(patientData);
      form.reset(formData);
    }
  }, [patientData, form]);

  const editPatient = async (data: EditPatientFormSchema) => {
    console.log('🚀 editPatient ejecutado con datos:', data);
    setIsSubmitting(true);
    setError(null);

    try {
      // Preparar el payload para el backend (basado en el body que proporcionaste)
      const payload: EditPatientRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        gender: data.gender,
        birthdate: data.birthdate,
        type: data.type,
        currentStatus: data.currentStatus,
        street: data.street,
        streetNumber: data.streetNumber,
        city: data.city,
        phone1: data.phone1,
        email: data.email,
        medicalHistory: data.medicalHistory,
        currentMedications: data.currentMedications,
        allergies: data.allergies,
      };

      console.log('📡 Enviando petición PATCH a:', DOCTOR_ENDPOINTS.patientProfile(patientId));
      console.log('📦 Payload completo:', payload);
      
      const response = await api(
        DOCTOR_ENDPOINTS.patientProfile(patientId),
        {
          method: 'PATCH',
          body: payload,
        }
      );
      
      console.log('✅ Respuesta del servidor:', response);

      onSuccess?.();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al editar el paciente';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = form.handleSubmit(
    (data) => {
      console.log('✅ Validación exitosa, datos:', data);
      editPatient(data);
    },
    (errors) => {
      console.log('❌ Errores de validación:', errors);
    }
  );

  const clearError = () => setError(null);

  return {
    form,
    handleSubmit,
    editPatient,
    isSubmitting,
    error,
    clearError,
  };
}
