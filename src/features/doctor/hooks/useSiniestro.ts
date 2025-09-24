"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { DOCTOR_ENDPOINTS } from "../constants/endpoints";

interface SiniestroResponse {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    data: {
        statusCode: number;
        message: string;
        data: {
            id: string;
            contingencyType: 'ACCIDENTE_TRABAJO' | 'ENFERMEDAD_PROFESIONAL' | 'ACCIDENTE_IN_ITINERE' | 'INTERCURRENCIA';
            accidentDateTime: string;
            status: 'ABIERTO' | 'CERRADO';
            dischargeReason: 'ALTA_MEDICA' | 'RECHAZO' | 'MUERTE' | 'FIN_TRATAMIENTO' | 'POR_DERIVACION' | null;
            closedAt?: string;
            closedByDoctor?: {
                id: string;
                licenseNumber: string;
                user: {
                    firstName: string;
                    lastName: string;
                };
            };
            art: {
                id: string;
                name: string;
                code: string;
                isActive: boolean;
                createdAt: string;
                updatedAt: string;
            };
            medicalEstablishment: {
                id: string;
                name: string;
                cuit: string;
                isActive: boolean;
                createdAt: string;
                updatedAt: string;
            };
            employer: {
                id: string;
                name: string;
                cuit: string;
                isActive: boolean;
                createdAt: string;
                updatedAt: string;
            };
            patient: {
                id: string;
                firstName: string;
                lastName: string;
                dni: string;
            };
            createdAt: string;
            updatedAt: string;
        };
    };
}

interface UseSiniestroReturn {
    siniestro: SiniestroResponse['data']['data'] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    clearError: () => void;
}

export function useSiniestro(siniestroId?: string): UseSiniestroReturn {
    const [siniestro, setSiniestro] = useState<SiniestroResponse['data']['data'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSiniestro = useCallback(async () => {
        if (!siniestroId) {
            setSiniestro(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api<SiniestroResponse>(
                DOCTOR_ENDPOINTS.siniestro(siniestroId)
            );

            console.log('🔍 DEBUG - useSiniestro response:', response);
            setSiniestro(response.data.data);
        } catch (err) {
            console.error('❌ Error en useSiniestro:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar información del siniestro');
            setSiniestro(null);
        } finally {
            setLoading(false);
        }
    }, [siniestroId]);

    const refetch = useCallback(() => {
        return fetchSiniestro();
    }, [fetchSiniestro]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    useEffect(() => {
        fetchSiniestro();
    }, [fetchSiniestro]);

    return {
        siniestro,
        loading,
        error,
        refetch,
        clearError,
    };
}
