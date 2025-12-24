"use client";

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { SpecialtyOption } from '../constant/specialties';

type SpecialtyResponse = {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message?: string;
    data: Array<{
      id: string;
      name: string;
    }>;
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

export function useSpecialties() {
  const [specialties, setSpecialties] = useState<SpecialtyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Iniciando carga de especialidades');
      console.log('📡 Llamando a /catalogs/especialidades/options?isActive=true');
      
      const response = await api<SpecialtyResponse>('/catalogs/especialidades/options?isActive=true');

      if (!response || !response.data) {
        throw new Error('Sin respuesta del servidor al obtener especialidades');
      }

      console.log('📥 Respuesta completa:', response);
      
      if (response.success && response.data && response.data.data) {
        console.log('📋 Datos de especialidades recibidos:', response.data.data);
        
        // Mapear la respuesta del backend al formato esperado
        const mappedSpecialties: SpecialtyOption[] = response.data.data.map((s) => ({
          id: s.id,
          label: s.name,
          code: s.name.toUpperCase().substring(0, 5), // Generar código desde el nombre si no viene
        }));
        
        console.log('✅ Especialidades mapeadas:', mappedSpecialties);
        setSpecialties(mappedSpecialties);
      } else {
        console.error('❌ Respuesta inválida:', { success: response.success, data: response.data });
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('❌ Error al cargar especialidades:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar especialidades';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar automáticamente al montar el componente
  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  return {
    specialties,
    loading,
    error,
    fetchSpecialties,
  };
}

