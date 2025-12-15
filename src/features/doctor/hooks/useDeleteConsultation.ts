"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { useDoctorStore } from '../store/doctorStore';

interface UseDeleteConsultationProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteConsultation({
  onSuccess,
  onError,
}: UseDeleteConsultationProps = {}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteConsultation = async (consultationId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      console.log('🗑️ Eliminando consulta:', consultationId);
      
      const endpoint = DOCTOR_ENDPOINTS.deleteConsultation(consultationId);
      
      console.log('📡 Enviando DELETE a:', endpoint);

      // Si estamos impersonando, enviar el doctorId como header
      const store = useDoctorStore.getState();
      const headers: Record<string, string> = {};
      if (store.isImpersonating && store.impersonatedDoctorId) {
        headers['X-Doctor-Id'] = store.impersonatedDoctorId;
      }

      await api(endpoint, {
        method: 'DELETE',
        ...(Object.keys(headers).length > 0 ? { headers } : {}),
      });

      console.log('✅ Consulta eliminada exitosamente');
      
      onSuccess?.();
      
    } catch (err) {
      console.error('❌ Error al eliminar consulta:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la consulta';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteConsultation,
    isDeleting,
    error,
  };
}
