'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '@/features/doctor/constants/endpoints';

export interface SocioData {
  codigo: string;
  plan: string;
  apellido: string;
  nombre: string;
  sexo: string;
  fechaNacimiento: string;
  tipoAfiliacion: string;
  dni: string;
}

export interface EligibilityResult {
  idTransaccion: string;
  status: 'OK' | 'NO';
  mensaje: string;
  rawMessage?: string;
  socio?: SocioData;
}

interface EligibilityApiResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: EligibilityResult;
  };
}

export function useValidateEligibility() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const validateEligibility = useCallback(async (codigoSocio: string): Promise<EligibilityResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Validando eligibilidad para código de socio:', codigoSocio);
      
      const response = await api<EligibilityApiResponse>(
        DOCTOR_ENDPOINTS.validateEligibility,
        {
          method: 'POST',
          body: {
            codigoSocio,
          },
        }
      );

      if (!response) {
        throw new Error('Sin respuesta del servidor');
      }

      if (!response.success) {
        throw new Error('Error al validar la eligibilidad');
      }

      const eligibilityData = response.data?.data;
      
      if (!eligibilityData) {
        throw new Error('No se recibieron datos de eligibilidad');
      }

      console.log('✅ Eligibilidad validada:', eligibilityData);
      setResult(eligibilityData);
      return eligibilityData;
    } catch (err) {
      console.error('❌ Error al validar eligibilidad:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error desconocido al validar la eligibilidad';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    validateEligibility,
    isLoading,
    error,
    result,
    clearError,
    clearResult,
  };
}
