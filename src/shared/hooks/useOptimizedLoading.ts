'use client';

import { useState, useCallback, useRef } from 'react';

interface OptimizedLoadingOptions {
    // Tiempo mínimo de loading para evitar flashes
    minLoadingTime?: number;
    // Tiempo máximo de loading antes de mostrar error
    maxLoadingTime?: number;
    // Si debe mantener datos anteriores durante loading
    preserveData?: boolean;
}

interface LoadingState {
    isLoading: boolean;
    error: string | null;
    isInitialLoad: boolean;
    hasData: boolean;
}

interface PaginationState {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
}

// Hook optimizado para manejar estados de loading
// Evita flashes de loading y maneja casos edge
export function useOptimizedLoading<T>(
    initialData: T | null = null,
    options: OptimizedLoadingOptions = {}
) {
    const {
        minLoadingTime = 300,
        maxLoadingTime = 30000,
        preserveData = true
    } = options;

    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(!initialData);
    
    const startTimeRef = useRef<number>(0);
    const minTimeTimeoutRef = useRef<number | undefined>(undefined);
    const maxTimeTimeoutRef = useRef<number | undefined>(undefined);

    const startLoading = useCallback((isRefresh = false) => {
        startTimeRef.current = Date.now();
        
        // Solo mostrar loading si no hay datos o no es un refresh
        if (!preserveData || !data || !isRefresh) {
            setLoading(true);
        }
        
        setError(null);
        
        // Timeout máximo
        maxTimeTimeoutRef.current = window.setTimeout(() => {
            setError('La operación está tomando más tiempo del esperado');
            setLoading(false);
        }, maxLoadingTime);
    }, [data, preserveData, maxLoadingTime]);

    const stopLoading = useCallback((newData?: T | null) => {
        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        // Limpiar timeout máximo
        if (maxTimeTimeoutRef.current) {
            clearTimeout(maxTimeTimeoutRef.current);
        }

        // Asegurar tiempo mínimo de loading
        minTimeTimeoutRef.current = window.setTimeout(() => {
            if (newData !== undefined) {
                setData(newData);
                setIsInitialLoad(false);
            }
            setLoading(false);
            setError(null);
        }, remainingTime);
    }, [minLoadingTime]);

    const setErrorState = useCallback((errorMessage: string) => {
        // Limpiar timeouts
        if (minTimeTimeoutRef.current) {
            clearTimeout(minTimeTimeoutRef.current);
        }
        if (maxTimeTimeoutRef.current) {
            clearTimeout(maxTimeTimeoutRef.current);
        }

        setError(errorMessage);
        setLoading(false);
    }, []);

    const reset = useCallback(() => {
        // Limpiar timeouts
        if (minTimeTimeoutRef.current) {
            clearTimeout(minTimeTimeoutRef.current);
        }
        if (maxTimeTimeoutRef.current) {
            clearTimeout(maxTimeTimeoutRef.current);
        }

        setData(null);
        setLoading(false);
        setError(null);
        setIsInitialLoad(true);
    }, []);

    // Cleanup al desmontar
    const cleanup = useCallback(() => {
        if (minTimeTimeoutRef.current) {
            clearTimeout(minTimeTimeoutRef.current);
        }
        if (maxTimeTimeoutRef.current) {
            clearTimeout(maxTimeTimeoutRef.current);
        }
    }, []);

    const state: LoadingState = {
        isLoading: loading,
        error,
        isInitialLoad,
        hasData: data !== null && data !== undefined
    };

    return {
        data,
        setData,
        ...state,
        startLoading,
        stopLoading,
        setErrorState,
        reset,
        cleanup
    };
}

// Hook para manejar loading states en listas con paginación
export function useListLoading<T>(
    initialItems: T[] = [],
    options: OptimizedLoadingOptions = {}
) {
    const {
        data: items,
        setData: setItems,
        isLoading,
        error,
        isInitialLoad,
        hasData,
        startLoading,
        stopLoading,
        setErrorState,
        reset
    } = useOptimizedLoading<T[]>(initialItems, options);

    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    });

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMore = useCallback(async (loadMoreFn: () => Promise<{ items: T[]; pagination: PaginationState }>) => {
        if (isLoadingMore || !pagination.page || pagination.page >= pagination.totalPages) {
            return;
        }

        setIsLoadingMore(true);
        try {
            const result = await loadMoreFn();
            setItems(prev => [...(prev || []), ...result.items]);
            setPagination(result.pagination);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al cargar más elementos';
            setErrorState(message);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, pagination, setItems, setErrorState]);

    const refresh = useCallback(async (refreshFn: () => Promise<{ items: T[]; pagination: PaginationState }>) => {
        startLoading(true);
        try {
            const result = await refreshFn();
            setItems(result.items);
            setPagination(result.pagination);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al actualizar';
            setErrorState(message);
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading, setItems, setErrorState]);

    return {
        items: items || [],
        pagination,
        isLoading,
        error,
        isInitialLoad,
        hasData,
        isLoadingMore,
        setItems,
        setPagination,
        startLoading,
        stopLoading,
        setErrorState,
        reset,
        loadMore,
        refresh
    };
}

// Hook para manejar loading states en operaciones CRUD
export function useCrudLoading<T>(
    initialData: T | null = null,
    options: OptimizedLoadingOptions = {}
) {
    const loadingState = useOptimizedLoading<T>(initialData, options);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const create = useCallback(async (createFn: () => Promise<T>) => {
        setIsCreating(true);
        try {
            const result = await createFn();
            loadingState.setData(result);
            return result;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al crear';
            loadingState.setErrorState(message);
            throw error;
        } finally {
            setIsCreating(false);
        }
    }, [loadingState]);

    const update = useCallback(async (updateFn: () => Promise<T>) => {
        setIsUpdating(true);
        try {
            const result = await updateFn();
            loadingState.setData(result);
            return result;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al actualizar';
            loadingState.setErrorState(message);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    }, [loadingState]);

    const remove = useCallback(async (deleteFn: () => Promise<void>) => {
        setIsDeleting(true);
        try {
            await deleteFn();
            loadingState.setData(null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al eliminar';
            loadingState.setErrorState(message);
            throw error;
        } finally {
            setIsDeleting(false);
        }
    }, [loadingState]);

    return {
        ...loadingState,
        isCreating,
        isUpdating,
        isDeleting,
        create,
        update,
        remove
    };
}
