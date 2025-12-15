import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { useDoctorStore } from '../store/doctorStore';

interface UseDeleteAppointmentOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteAppointment({
  onSuccess,
  onError,
}: UseDeleteAppointmentOptions) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAppointment = useCallback(async (appointmentId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      console.log('🎯 Eliminando turno:', appointmentId);

      const endpoint = DOCTOR_ENDPOINTS.deleteAppointment(appointmentId);

      console.log('📡 Enviando DELETE a:', endpoint);

      // Si estamos impersonando, enviar el doctorId como header
      const store = useDoctorStore.getState();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (store.isImpersonating && store.impersonatedDoctorId) {
        headers['X-Doctor-Id'] = store.impersonatedDoctorId;
      }

      await api(endpoint, {
        method: 'DELETE',
        headers,
      });

      console.log('✅ Turno eliminado exitosamente');
      onSuccess?.();

    } catch (err) {
      console.error('❌ Error al eliminar turno:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar turno';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [onSuccess, onError]);

  const clearError = useCallback(() => setError(null), []);

  return {
    deleteAppointment,
    isDeleting,
    error,
    clearError,
  };
}



