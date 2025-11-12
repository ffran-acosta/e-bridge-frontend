import { useState, useEffect, useCallback } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, JsonValue } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
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
    console.log('🚀 createPatient ejecutado con datos:', data);
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

      console.log('📡 Enviando petición a:', DOCTOR_ENDPOINTS.patients);
      console.log('📦 Payload completo:', payload);
      console.log('🔍 Tipo en payload:', payload.type);
      console.log('🔍 DefaultType recibido:', defaultType);
      
      const response = await api<CreatePatientResponse>(
        DOCTOR_ENDPOINTS.patients,
        {
          method: 'POST',
          body: payload as unknown as JsonValue,
        }
      );
      
      if (!response) {
        throw new Error('Sin respuesta del servidor al crear el paciente');
      }

      console.log('✅ Respuesta del servidor:', response);
      console.log('🔍 Tipo en respuesta:', response.data?.data?.type);
      console.log('🔍 Datos completos de respuesta:', JSON.stringify(response, null, 2));

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
      console.log('✅ Validación exitosa, datos:', data);
      createPatient(data);
    },
    (errors) => {
      console.log('❌ Errores de validación:', errors);
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
    console.log('🔍 Iniciando carga de obras sociales...');
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Llamando a /catalogs/obras-sociales');
      const response = await api<InsuranceResponse>('/catalogs/obras-sociales');

      if (!response || !response.data) {
        throw new Error('Sin respuesta del servidor al obtener obras sociales');
      }

      if (response.success && response.data.data) {
        console.log('✅ Obras sociales cargadas:', response.data.data);
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
