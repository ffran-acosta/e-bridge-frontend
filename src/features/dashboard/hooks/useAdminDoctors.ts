"use client";
import { useAuthStore } from '@/features/auth';
import { useCallback, useEffect, useState } from 'react';
import { transformDoctor } from '../store/dashboard';
import { Doctor, BackendDoctor } from '../types/dashboard';
import { DASHBOARD_ENDPOINTS } from '../constants/endpoints';

type AdminDoctorsResponse =
    | BackendDoctor[]
    | { data?: BackendDoctor[] }
    | { data?: { data?: BackendDoctor[] } };

export function useAdminDoctors(searchTerm: string = '') {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { apiWithAuth } = useAuthStore();

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiWithAuth<AdminDoctorsResponse>(DASHBOARD_ENDPOINTS.admin.doctors);

            if (!response) {
                throw new Error('Sin respuesta del servidor al obtener médicos');
            }

            let rawData: BackendDoctor[] = [];

            if (Array.isArray(response)) {
                rawData = response;
            } else if (typeof response === 'object') {
                const topLevel = response as { data?: BackendDoctor[] | { data?: BackendDoctor[] } };
                if (Array.isArray(topLevel.data)) {
                    rawData = topLevel.data;
                } else if (topLevel.data && Array.isArray((topLevel.data as { data?: BackendDoctor[] }).data)) {
                    rawData = (topLevel.data as { data?: BackendDoctor[] }).data ?? [];
                }
            }

            const transformedDoctors = rawData.map(transformDoctor);

            setDoctors(transformedDoctors);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Error al cargar médicos';
            setError(message);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    }, [apiWithAuth]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const filteredDoctors = doctors.filter(doctor => {
        if (searchTerm && searchTerm.trim() !== '') {
            const search = searchTerm.toLowerCase().trim();
            const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
            const specialty = doctor.specialty.name.toLowerCase();
            const license = doctor.licenseNumber.toLowerCase();

            return fullName.includes(search) ||
                specialty.includes(search) ||
                license.includes(search);
        }
        return true;
    });

    console.log('🔍 Doctors in hook:', doctors);
    console.log('🔍 Search term:', searchTerm);
    console.log('🔍 Filtered doctors:', filteredDoctors);

    return {
        doctors: filteredDoctors,
        loading,
        error,
        refetch: fetchDoctors,
        clearError: () => setError(null),
        totalDoctors: filteredDoctors.length
    };
}