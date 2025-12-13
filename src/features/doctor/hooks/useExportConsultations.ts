'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import type {
    ExportConsultation,
    ExportConsultationsParams,
    ExportConsultationsResponse,
    ExportConsultationsPagination,
} from '../types/export-consultations.types';

interface UseExportConsultationsReturn {
    consultations: ExportConsultation[];
    pagination: ExportConsultationsPagination | null;
    loading: boolean;
    error: string | null;
    filters: ExportConsultationsParams;
    setFilters: (filters: Partial<ExportConsultationsParams>) => void;
    refetch: () => Promise<void>;
    clearError: () => void;
}

const DEFAULT_FILTERS: ExportConsultationsParams = {
    page: 1,
    limit: 20,
    patientType: 'ART', // Por defecto mostrar ART
};

export function useExportConsultations(
    initialFilters?: ExportConsultationsParams
): UseExportConsultationsReturn {
    const [consultations, setConsultations] = useState<ExportConsultation[]>([]);
    const [pagination, setPagination] = useState<ExportConsultationsPagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<ExportConsultationsParams>({
        ...DEFAULT_FILTERS,
        ...initialFilters,
    });

    const buildQueryParams = useCallback((params: ExportConsultationsParams): string => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.set('page', params.page.toString());
        if (params.limit) queryParams.set('limit', params.limit.toString());
        if (params.patientType) queryParams.set('patientType', params.patientType);
        if (params.type) queryParams.set('type', params.type);
        if (params.startDate) queryParams.set('startDate', params.startDate);
        if (params.endDate) queryParams.set('endDate', params.endDate);
        if (params.search) queryParams.set('search', params.search);
        if (params.patientId) queryParams.set('patientId', params.patientId);

        return queryParams.toString();
    }, []);

    const fetchConsultations = useCallback(async (params: ExportConsultationsParams) => {
        setLoading(true);
        setError(null);

        try {
            const queryString = buildQueryParams(params);
            const response = await api<ExportConsultationsResponse>(
                `${DOCTOR_ENDPOINTS.exportList}?${queryString}`
            );

            if (!response || !response.data) {
                throw new Error('Sin respuesta del servidor al obtener consultas');
            }

            setConsultations(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar consultas';
            setError(errorMessage);
            setConsultations([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [buildQueryParams]);

    // Fetch inicial y cuando cambian los filtros
    useEffect(() => {
        fetchConsultations(filters);
    }, [filters, fetchConsultations]);

    const setFilters = useCallback((newFilters: Partial<ExportConsultationsParams>) => {
        setFiltersState((prev) => {
            const updated = { ...prev, ...newFilters };
            // Resetear a página 1 cuando cambian otros filtros (excepto page y limit)
            if (newFilters.page === undefined && newFilters.limit === undefined) {
                updated.page = 1;
            }
            return updated;
        });
    }, []);

    const refetch = useCallback(async () => {
        await fetchConsultations(filters);
    }, [filters, fetchConsultations]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        consultations,
        pagination,
        loading,
        error,
        filters,
        setFilters,
        refetch,
        clearError,
    };
}
