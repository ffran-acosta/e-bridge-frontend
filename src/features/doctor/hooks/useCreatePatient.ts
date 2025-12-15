import { useState, useEffect, useCallback } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, JsonValue } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { useDoctorStore } from '../store/doctorStore';
import { 
  createPatientSchema, 
  defaultFormValues, 
  type CreatePatientFormSchema 
} from '../lib/patient-form.schema';
import { 
  CreatePatientFormData, 
  CreatePatientRequest, 
  CreatePatientResponse,
  InsuranceResponse 
} from '../types/patient-form.types';

interface UseCreatePatientOptions {
  defaultType?: 'NORMAL' | 'ART';
  onSuccess?: (patient: CreatePatientResponse) => void;
  onError?: (error: string) => void;
}

export function useCreatePatient(options: UseCreatePatientOptions = {}) {
  const { defaultType = 'NORMAL', onSuccess, onError } = options;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isImpersonating, impersonatedDoctorId } = useDoctorStore();

  const form = useForm<CreatePatientFormSchema>({
    resolver: zodResolver(createPatientSchema) as Resolver<CreatePatientFormSchema>,
    defaultValues: {
      firstName: '',
      lastName: '',
      dni: '',
      gender: 'MASCULINO' as const,
      birthdate: '',
      insuranceId: '',
      type: defaultType,
      medicalHistory: [],
      currentMedications: [],
      allergies: [],
    },
    mode: 'onChange' as const,
  });

  // Actualizar el tipo cuando cambie defaultType
  useEffect(() => {
    form.setValue('type', defaultType);
  }, [defaultType, form]);

  const createPatient = async (data: CreatePatientFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Preparar el payload para el backend
      const payload: CreatePatientRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        dni: data.dni,
        gender: data.gender,
        birthdate: data.birthdate,
        insuranceId: data.insuranceId,
        type: data.type,
        street: data.street,
        streetNumber: data.streetNumber,
        floor: data.floor,
        apartment: data.apartment,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        phone1: data.phone1,
        phone2: data.phone2,
        email: data.email,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelation: data.emergencyContactRelation,
        medicalHistory: data.medicalHistory,
        currentMedications: data.currentMedications,
        allergies: data.allergies,
      };
      
      // Si estamos impersonando, enviar el doctorId como header
      // El backend está configurado para aceptar X-Doctor-Id en CORS
      const headers: Record<string, string> = {};
      if (isImpersonating && impersonatedDoctorId) {
        headers['X-Doctor-Id'] = impersonatedDoctorId;
      }
      
      const response = await api<CreatePatientResponse>(
        DOCTOR_ENDPOINTS.patients,
        {
          method: 'POST',
          body: payload as unknown as JsonValue,
          ...(Object.keys(headers).length > 0 ? { headers } : {}),
        }
      );
      
      if (!response) {
        throw new Error('Sin respuesta del servidor al crear el paciente');
      }

      // Limpiar el formulario después del éxito
      form.reset({
        ...defaultFormValues,
        type: defaultType,
      });

      onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el paciente';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = form.handleSubmit(
    (data) => {
      createPatient(data);
    },
    () => {
      // Errores de validación manejados por react-hook-form
    }
  );

  const clearError = () => setError(null);

  return {
    form,
    handleSubmit,
    createPatient,
    isSubmitting,
    error,
    clearError,
  };
}

// Hook para obtener las obras sociales (insurances)
export function useInsurances() {
  const [insurances, setInsurances] = useState<InsuranceResponse['data']['data']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsurances = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api<InsuranceResponse>('/catalogs/obras-sociales');

      if (!response || !response.data) {
        throw new Error('Sin respuesta del servidor al obtener obras sociales');
      }

      if (response.success && response.data.data) {
        setInsurances(response.data.data);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('❌ Error al cargar obras sociales:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar obras sociales';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    insurances,
    loading,
    error,
    fetchInsurances,
  };
}
