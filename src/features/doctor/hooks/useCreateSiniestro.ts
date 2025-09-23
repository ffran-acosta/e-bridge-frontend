import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { 
  createSiniestroSchema, 
  defaultSiniestroFormValues, 
  type CreateSiniestroFormSchema 
} from '../lib/siniestro-form.schema';
import { 
  CreateSiniestroFormData, 
  CreateSiniestroRequest, 
  CreateSiniestroResponse,
  ARTResponse,
  MedicalEstablishmentResponse,
  EmployerResponse 
} from '../types/siniestro-form.types';

interface UseCreateSiniestroOptions {
  patientId: string;
  onSuccess?: (siniestro: CreateSiniestroResponse) => void;
  onError?: (error: string) => void;
}

export function useCreateSiniestro(options: UseCreateSiniestroOptions) {
  const { patientId, onSuccess, onError } = options;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(createSiniestroSchema),
    defaultValues: {
      patientId: patientId,
      artId: '',
      medicalEstablishmentId: '',
      employerId: '',
      contingencyType: 'ACCIDENTE_TRABAJO' as const,
      accidentDateTime: '',
    },
    mode: 'onChange' as const,
  });

  // Actualizar patientId cuando cambie
  useEffect(() => {
    form.setValue('patientId', patientId);
  }, [patientId, form]);

  const createSiniestro = async (data: CreateSiniestroFormData) => {
    console.log('🚀 createSiniestro ejecutado con datos:', data);
    setIsSubmitting(true);
    setError(null);

    try {
      // Preparar el payload para el backend
      const payload: CreateSiniestroRequest = {
        patientId: data.patientId,
        artId: data.artId,
        medicalEstablishmentId: data.medicalEstablishmentId,
        employerId: data.employerId,
        contingencyType: data.contingencyType,
        accidentDateTime: data.accidentDateTime,
      };

      console.log('📡 Enviando petición a: /siniestros');
      console.log('📦 Payload completo:', payload);
      console.log('🔍 medicalEstablishmentId:', payload.medicalEstablishmentId);
      console.log('🔍 artId:', payload.artId);
      console.log('🔍 employerId:', payload.employerId);
      
      const response = await api<CreateSiniestroResponse>('/siniestros', {
        method: 'POST',
        body: payload,
      });
      
      console.log('✅ Respuesta del servidor:', response);

      // Limpiar el formulario después del éxito
      form.reset({
        ...defaultSiniestroFormValues,
        patientId: patientId,
      });

      onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el siniestro';
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
      createSiniestro(data);
    },
    (errors) => {
      console.log('❌ Errores de validación:', errors);
    }
  );

  const clearError = () => setError(null);

  return {
    form,
    handleSubmit,
    createSiniestro,
    isSubmitting,
    error,
    clearError,
  };
}

// Hook para obtener las ART
export function useARTs() {
  const [arts, setARTs] = useState<ARTResponse['data']['data']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchARTs = useCallback(async () => {
    console.log('🔍 Iniciando carga de ART...');
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Llamando a /catalogs/arts');
      const response = await api<ARTResponse>('/catalogs/arts');
      
      if (response.data?.data) {
        console.log('✅ ART cargadas:', response.data.data);
        setARTs(response.data.data);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('❌ Error al cargar ART:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar ART';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    arts,
    loading,
    error,
    fetchARTs,
  };
}

// Hook para obtener los establecimientos médicos
export function useMedicalEstablishments() {
  const [establishments, setEstablishments] = useState<MedicalEstablishmentResponse['data']['data']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usando endpoint real de establecimientos médicos
  const USE_MOCK_DATA = false;

  const fetchEstablishments = useCallback(async () => {
    console.log('🔍 Iniciando carga de establecimientos médicos...');
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        console.log('📦 Usando datos mock para establecimientos (endpoint no disponible)');
        // Datos mock de establecimientos médicos (estructura actualizada)
        const mockEstablishments: MedicalEstablishmentResponse['data']['data'] = [
          {
            id: 'f2dcb104-4c95-49ee-8810-9a46f6c675c6',
            name: 'CLINICA CENTRO MEDICO PRIVADO',
            cuit: '20-12345678-9',
            isActive: true,
            createdAt: '2025-09-16T20:33:21.710Z',
            updatedAt: '2025-09-16T20:33:21.710Z'
          },
          {
            id: 'e6f83dc9-b3bf-4fb3-bc9a-4d8f163bdd13',
            name: 'CLINICA LA PEQUEÑA FAMILIA',
            cuit: '20-23456789-0',
            isActive: true,
            createdAt: '2025-09-16T20:33:21.712Z',
            updatedAt: '2025-09-16T20:33:21.712Z'
          },
          {
            id: 'c1e48005-9db2-46a0-8778-2e092e9dd7a7',
            name: 'CONSULTORIOS WINTER',
            cuit: '20-45678901-2',
            isActive: true,
            createdAt: '2025-09-16T20:33:21.714Z',
            updatedAt: '2025-09-16T20:33:21.714Z'
          }
        ];
        setEstablishments(mockEstablishments);
        console.log('✅ Establecimientos mock cargados:', mockEstablishments);
      } else {
        console.log('📡 Llamando a /catalogs/establecimientos');
        const response = await api<MedicalEstablishmentResponse>('/catalogs/establecimientos');
        
        if (response.data?.data) {
          console.log('✅ Establecimientos cargados:', response.data.data);
          setEstablishments(response.data.data);
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      }
    } catch (err) {
      console.error('❌ Error al cargar establecimientos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar establecimientos médicos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [USE_MOCK_DATA]);

  return {
    establishments,
    loading,
    error,
    fetchEstablishments,
  };
}

// Hook para obtener los empleadores
export function useEmployers() {
  const [employers, setEmployers] = useState<EmployerResponse['data']['data']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployers = useCallback(async () => {
    console.log('🔍 Iniciando carga de empleadores...');
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Llamando a /catalogs/empleadores');
      const response = await api<EmployerResponse>('/catalogs/empleadores');
      
      if (response.data?.data) {
        console.log('✅ Empleadores cargados:', response.data.data);
        setEmployers(response.data.data);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('❌ Error al cargar empleadores:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar empleadores';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    employers,
    loading,
    error,
    fetchEmployers,
  };
}
