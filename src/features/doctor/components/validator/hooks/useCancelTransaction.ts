'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../../../constants/endpoints';

export interface CancelTransactionRequest {
  codigoSocio: string;
  tipoIdAnul: 'IDTRAN';
  idAnul: string;
  motivo?: string;
}

export interface CancelTransactionResponse {
  idTransaccion: string;
  status: 'OK' | 'NO' | 'PEND';
  mensaje: string;
  // Otros campos que pueda devolver el backend
}

interface CancelTransactionApiResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: CancelTransactionResponse;
  };
}

export function useCancelTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CancelTransactionResponse | null>(null);

  const cancelTransaction = useCallback(async (data: CancelTransactionRequest): Promise<CancelTransactionResponse | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const requestBody = {
        codigoSocio: data.codigoSocio,
        tipoIdAnul: 'IDTRAN' as const,
        idAnul: data.idAnul,
        motivo: data.motivo || '',
      };

      console.log('📤 Enviando anulación:', requestBody);

      const response = await api<CancelTransactionApiResponse>(
        DOCTOR_ENDPOINTS.cancelTransaction,
        {
          method: 'POST',
          body: requestBody,
        }
      );

      if (!response) {
        throw new Error('Sin respuesta del servidor');
      }

      if (!response.success || response.statusCode !== 200) {
        throw new Error(response.data?.message || 'Error al anular la transacción');
      }

      const cancelData = response.data?.data;
      
      if (!cancelData) {
        throw new Error('No se recibieron datos de anulación');
      }

      setResult(cancelData);
      setIsLoading(false);
      return cancelData;
    } catch (err) {
      console.error('Error al anular transacción:', err);
      let errorMessage = 'Error desconocido al anular la transacción';
      
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
    cancelTransaction,
    isLoading,
    error,
    result,
    clearError,
    clearResult,
  };
}


