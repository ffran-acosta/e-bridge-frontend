import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { ENDPOINTS } from '@/lib/endpoints';
import { BackendDoctor, Doctor } from '@/types/dashboard';
import { transformDoctor } from '@/store/dashboard';

export function useAdminDoctors(searchTerm: string = '') {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { apiWithAuth } = useAuthStore();

    const fetchDoctors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiWithAuth<{ data: BackendDoctor[] }>(ENDPOINTS.admin.doctors);
            console.log('🔍 Raw response:', response);
            console.log('🔍 Response data:', response.data);

            const doctorsData = Array.isArray(response.data) ? response.data : [];
            console.log('🔍 Doctors data before transform:', doctorsData);

            const transformedDoctors = doctorsData.map(transformDoctor);
            console.log('🔍 Doctors after transform:', transformedDoctors);

            setDoctors(transformedDoctors);
        } catch (error: any) {
            console.error('Error fetching admin doctors:', error);
            setError(error.message || 'Error al cargar médicos');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('🔍 useEffect ejecutándose...');
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