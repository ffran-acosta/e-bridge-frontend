'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import type { Transaction, TransactionsResponse, TransactionFilters, OperationType, TransactionStatus } from '../components/validator/types';

interface ValidatorState {
  transactions: Transaction[];
  pagination: TransactionsResponse['pagination'];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
}

interface ValidatorActions {
  fetchTransactions: (filters?: Partial<TransactionFilters>) => Promise<void>;
  updateFilters: (newFilters: Partial<TransactionFilters>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
  clearError: () => void;
  reset: () => void;
}

type ValidatorStore = ValidatorState & ValidatorActions;

interface TransactionsApiResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: {
    statusCode: number;
    message: string;
    data: TransactionsResponse;
  };
}

const initialState: ValidatorState = {
  transactions: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 20,
    // Sin filtro por defecto - mostrar todos los tipos de operación
  },
};

const buildQueryParams = (filters: TransactionFilters): string => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.operationType) params.append('operationType', filters.operationType);
  if (filters.status) params.append('status', filters.status);
  if (filters.codigoSocio) params.append('codigoSocio', filters.codigoSocio);
  if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
  if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
  if (filters.idTransaccion) params.append('idTransaccion', filters.idTransaccion);
  if (filters.idAutorizacion) params.append('idAutorizacion', filters.idAutorizacion);
  
  return params.toString();
};

export const useValidatorStore = create<ValidatorStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchTransactions: async (newFilters?: Partial<TransactionFilters>) => {
        const { loading, filters: currentFilters } = get();

        // Evitar múltiples requests simultáneos
        if (loading) return;

        // Combinar filtros actuales con los nuevos
        const mergedFilters: TransactionFilters = {
          ...currentFilters,
          ...newFilters,
        };

        set({ loading: true, error: null, filters: mergedFilters });

        try {
          console.log('🔍 Obteniendo transacciones con filtros:', mergedFilters);
          
          const queryParams = buildQueryParams(mergedFilters);
          const endpoint = queryParams 
            ? `${DOCTOR_ENDPOINTS.listTransactions}?${queryParams}`
            : DOCTOR_ENDPOINTS.listTransactions;
          
          const response = await api<TransactionsApiResponse>(
            endpoint,
            {
              method: 'GET',
            }
          );

          if (!response) {
            throw new Error('Sin respuesta del servidor');
          }

          if (!response.success || response.statusCode !== 200) {
            throw new Error(response.data?.message || 'Error al obtener las transacciones');
          }

          const transactionsData = response.data?.data;
          
          if (!transactionsData) {
            throw new Error('No se recibieron datos de transacciones');
          }

          console.log('✅ Transacciones obtenidas:', transactionsData);
          set({
            transactions: transactionsData.transacciones || [],
            pagination: transactionsData.pagination || {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
            },
            loading: false,
            error: null,
          });
        } catch (err) {
          console.error('❌ Error al obtener transacciones:', err);
          let errorMessage = 'Error desconocido al obtener las transacciones';
          
          if (err instanceof Error) {
            errorMessage = err.message;
            // Si es un error de autenticación, mensaje más claro
            if (err.message.includes('Unauthorized') || err.message.includes('401')) {
              errorMessage = 'No tienes permisos para acceder a esta información. Por favor, inicia sesión nuevamente.';
            }
          }
          
          set({
            loading: false,
            error: errorMessage,
            transactions: [],
            // Mantener paginación en estado inicial para evitar errores
            pagination: {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
            },
          });
        }
      },

      updateFilters: (newFilters: Partial<TransactionFilters>) => {
        const { filters: currentFilters } = get();
        const updatedFilters: TransactionFilters = {
          ...currentFilters,
          ...newFilters,
          page: newFilters.page ?? 1, // Resetear a página 1 cuando cambian otros filtros
        };
        set({ filters: updatedFilters });
        // Trigger fetch automáticamente
        get().fetchTransactions(updatedFilters);
      },

      setPage: (page: number) => {
        const { filters: currentFilters } = get();
        const updatedFilters = { ...currentFilters, page };
        set({ filters: updatedFilters });
        get().fetchTransactions(updatedFilters);
      },

      setLimit: (limit: number) => {
        const { filters: currentFilters } = get();
        const updatedFilters = { ...currentFilters, limit, page: 1 }; // Resetear a página 1
        set({ filters: updatedFilters });
        get().fetchTransactions(updatedFilters);
      },

      clearFilters: () => {
        const clearedFilters: TransactionFilters = {
          page: 1,
          limit: 20,
        };
        set({ filters: clearedFilters });
        get().fetchTransactions(clearedFilters);
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: 'ValidatorStore' }
  )
);
