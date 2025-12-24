'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../../../constants/endpoints';

export interface AuthorizeRequest {
  codigoSocio: string; // 8 dígitos o 11 si incluye token (todo junto)
  codigoPrestacion: string; // Código de prestación, por ahora solo "420101"
}

export interface AuthorizeResponse {
  idTransaccion: string;
  idAutorizacion: string | null;
  status: 'OK' | 'NO' | 'PEND';
  mensaje: string;
  // Otros campos que pueda devolver el backend
}

interface AuthorizeApiResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: AuthorizeResponse;
  };
}

export function useAuthorize() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthorizeResponse | null>(null);

  const authorize = useCallback(async (data: { codigoSocio: string; token?: string; codigoPrestacion: string }): Promise<AuthorizeResponse | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Limpiar el código de socio (remover caracteres no numéricos)
      const codigoSocioCleaned = data.codigoSocio.replace(/\D/g, '');
      
      // Si hay token, limpiarlo y concatenarlo al código de socio
      const tokenCleaned = data.token ? data.token.replace(/\D/g, '') : '';
      const codigoSocioFinal = tokenCleaned ? codigoSocioCleaned + tokenCleaned : codigoSocioCleaned;

      console.log('📤 Enviando autorización:', {
        codigoSocio: codigoSocioFinal,
        codigoPrestacion: data.codigoPrestacion
      });

      const requestBody = {
        codigoSocio: codigoSocioFinal,
        codigoPrestacion: data.codigoPrestacion,
      };

      console.log('📤 Body a enviar:', requestBody);

      const response = await api<AuthorizeApiResponse>(
        DOCTOR_ENDPOINTS.authorize,
        {
          method: 'POST',
          body: requestBody, // api() ya hace JSON.stringify internamente
        }
      );

      if (!response) {
        throw new Error('Sin respuesta del servidor');
      }

      if (!response.success || response.statusCode !== 200) {
        throw new Error(response.data?.message || 'Error al autorizar la consulta');
      }

      const authorizeData = response.data?.data;
      
      if (!authorizeData) {
        throw new Error('No se recibieron datos de autorización');
      }

      setResult(authorizeData);
      setIsLoading(false);
      return authorizeData;
    } catch (err) {
      console.error('Error al autorizar:', err);
      let errorMessage = 'Error desconocido al autorizar la consulta';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    authorize,
    isLoading,
    error,
    result,
    clearError,
    clearResult,
  };
}
