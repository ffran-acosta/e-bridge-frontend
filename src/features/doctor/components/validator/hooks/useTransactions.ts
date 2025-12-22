'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '@/features/doctor/constants/endpoints';
import type { Transaction, TransactionsResponse, TransactionFilters } from '../types';

interface TransactionsApiResponse {
  statusCode: number;
  message: string;
  data: TransactionsResponse;
}

export function useTransactions(initialFilters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<TransactionsResponse['pagination']>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  const buildQueryParams = useCallback((filters: TransactionFilters): string => {
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
  }, []);

  const fetchTransactions = useCallback(async (currentFilters: TransactionFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Obteniendo transacciones con filtros:', currentFilters);
      
      const queryParams = buildQueryParams(currentFilters);
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

      if (response.statusCode !== 200) {
        throw new Error(response.message || 'Error al obtener las transacciones');
      }

      const transactionsData = response.data;
      
      if (!transactionsData) {
        throw new Error('No se recibieron datos de transacciones');
      }

      console.log('✅ Transacciones obtenidas:', transactionsData);
      setTransactions(transactionsData.transacciones);
      setPagination(transactionsData.pagination);
      return transactionsData;
    } catch (err) {
      console.error('❌ Error al obtener transacciones:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error desconocido al obtener las transacciones';
      setError(errorMessage);
      setTransactions([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryParams]);

  // Cargar transacciones cuando cambian los filtros
  useEffect(() => {
    fetchTransactions(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<TransactionFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // Resetear a página 1 cuando cambian otros filtros
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 })); // Resetear a página 1 al cambiar límite
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
    });
  }, []);

  const refetch = useCallback(() => {
    return fetchTransactions(filters);
  }, [filters, fetchTransactions]);

  return {
    transactions,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    setPage,
    setLimit,
    clearFilters,
    refetch,
  };
}
