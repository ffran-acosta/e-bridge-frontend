"use client";

import { useState, useEffect } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JsonValue } from '@/lib/api';
import { useAuthStore } from '../store/auth';
import { AUTH_ENDPOINTS } from '../constant/enpoints';
import { updateProfileSchema, UpdateProfileInput } from '../lib/profile-form.schema';
import { User } from '@/shared/types/auth';

interface UseUpdateProfileProps {
  userData?: User | null;
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

const mapUserDataToForm = (userData?: User | null): Partial<UpdateProfileInput> => {
  if (!userData) {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: undefined,
      licenseNumber: '',
      specialtyId: '',
      province: undefined
    };
  }

  const specialtyId = userData.doctor?.specialty?.id || '';
  console.log('📋 Mapeando datos del usuario:', {
    specialtyId,
    specialty: userData.doctor?.specialty,
    doctor: userData.doctor
  });

  return {
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    password: undefined, // Nunca precargamos la contraseña - debe venir vacío
    licenseNumber: userData.doctor?.licenseNumber || '',
    specialtyId: specialtyId,
    province: userData.doctor?.province as "Santa Fe" | "Buenos Aires" | undefined
  };
};

export function useUpdateProfile({
  userData,
  onSuccess,
  onError,
}: UseUpdateProfileProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiWithAuth } = useAuthStore();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema) as Resolver<UpdateProfileInput>,
    defaultValues: mapUserDataToForm(userData),
  });

  // Actualizar valores del formulario cuando cambie userData
  useEffect(() => {
    const formValues = mapUserDataToForm(userData);
    console.log('🔄 Actualizando valores del formulario:', formValues);
    form.reset(formValues);
  }, [userData, form]);

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (data: UpdateProfileInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('🎯 Actualizando perfil:', data);
      
      // Preparar el body, excluyendo password si está vacío y province si no se proporcionó
      const requestBody: Record<string, string> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        licenseNumber: data.licenseNumber,
        specialtyId: data.specialtyId,
      };

      // Solo incluir password si se proporcionó
      if (data.password && data.password.trim() !== '') {
        requestBody.password = data.password;
      }

      // Solo incluir province si se proporcionó
      if (data.province) {
        requestBody.province = data.province;
      }

      console.log('📡 Enviando request a:', AUTH_ENDPOINTS.profile);
      console.log('📡 Request body:', requestBody);

      const response = await apiWithAuth<{
        success: boolean;
        statusCode: number;
        timestamp: string;
        path: string;
        data: {
          statusCode: number;
          data: User;
        };
      }>(AUTH_ENDPOINTS.profile, {
        method: 'PATCH',
        body: requestBody as unknown as JsonValue,
      });

      if (!response || !response.data?.data) {
        throw new Error('Sin respuesta del servidor al actualizar el perfil');
      }

      console.log('✅ Perfil actualizado exitosamente:', response.data.data);
      
      onSuccess?.(response.data.data);
      
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    error,
    clearError,
  };
}
