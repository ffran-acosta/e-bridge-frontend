"use client";
import { useAuthStore } from '@/features/auth';
import { useEffect, useState } from 'react';
import { transformDoctor } from '../store/dashboard';
import { Doctor, BackendDoctor } from '../types/dashboard';
import { DASHBOARD_ENDPOINTS } from '../constants/endpoints';

export function useAdminDoctors(searchTerm: string = '') {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { apiWithAuth } = useAuthStore();

    const fetchDoctors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiWithAuth<{ data: BackendDoctor[] }>(DASHBOARD_ENDPOINTS.admin.doctors);

            const doctorsData = Array.isArray(response.data) ? response.data : [];

            const transformedDoctors = doctorsData.map(transformDoctor);

            setDoctors(transformedDoctors);
        } catch (error: any) {
            setError(error.message || 'Error al cargar médicos');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

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