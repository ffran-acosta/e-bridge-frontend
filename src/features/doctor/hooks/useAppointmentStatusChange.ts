import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { useDoctorStore } from '../store/doctorStore';

interface UseAppointmentStatusChangeOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useAppointmentStatusChange({
  onSuccess,
  onError,
}: UseAppointmentStatusChangeOptions) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelAppointment = useCallback(async (appointmentId: string, reason: string, notes?: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log('🎯 Cancelando turno:', appointmentId);

      const endpoint = DOCTOR_ENDPOINTS.cancelAppointment(appointmentId);

      const requestBody = {
        reason,
        notes: notes || '',
      };

      console.log('📡 Enviando POST a:', endpoint);
      console.log('📡 Request body:', requestBody);

      // Si estamos impersonando, enviar el doctorId como header
      const store = useDoctorStore.getState();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (store.isImpersonating && store.impersonatedDoctorId) {
        headers['X-Doctor-Id'] = store.impersonatedDoctorId;
      }

      await api(endpoint, {
        method: 'POST',
        headers,
        body: requestBody,
      });

      console.log('✅ Turno cancelado exitosamente');
      onSuccess?.();

    } catch (err) {
      console.error('❌ Error al cancelar turno:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cancelar turno';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess, onError]);

  const completeAppointment = useCallback(async (appointmentId: string, medicalEventId: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log('🎯 Completando turno:', appointmentId);

      const endpoint = DOCTOR_ENDPOINTS.completeAppointment(appointmentId);

      const requestBody = {
        medicalEventId,
      };

      console.log('📡 Enviando POST a:', endpoint);
      console.log('📡 Request body:', requestBody);

      // Si estamos impersonando, enviar el doctorId como header
      const store = useDoctorStore.getState();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (store.isImpersonating && store.impersonatedDoctorId) {
        headers['X-Doctor-Id'] = store.impersonatedDoctorId;
      }

      await api(endpoint, {
        method: 'POST',
        headers,
        body: requestBody,
      });

      console.log('✅ Turno completado exitosamente');
      onSuccess?.();

    } catch (err) {
      console.error('❌ Error al completar turno:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al completar turno';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess, onError]);

  const rescheduleAppointment = useCallback(async (appointmentId: string, scheduledDateTime: string, notes?: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log('🎯 Reagendando turno:', appointmentId);

      const endpoint = DOCTOR_ENDPOINTS.updateAppointment(appointmentId);

      const requestBody = {
        scheduledDateTime,
        notes: notes || '',
      };

      console.log('📡 Enviando PATCH a:', endpoint);
      console.log('📡 Request body:', requestBody);

      // Si estamos impersonando, enviar el doctorId como header
      const store = useDoctorStore.getState();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (store.isImpersonating && store.impersonatedDoctorId) {
        headers['X-Doctor-Id'] = store.impersonatedDoctorId;
      }

      await api(endpoint, {
        method: 'PATCH',
        headers,
        body: requestBody,
      });

      console.log('✅ Turno reagendado exitosamente');
      onSuccess?.();

    } catch (err) {
      console.error('❌ Error al reagendar turno:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al reagendar turno';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [onSuccess, onError]);

  const clearError = useCallback(() => setError(null), []);

  return {
    cancelAppointment,
    completeAppointment,
    rescheduleAppointment,
    isUpdating,
    error,
    clearError,
  };
}



