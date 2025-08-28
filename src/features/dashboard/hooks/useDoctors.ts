"use client";
import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboard';

export function useDoctors(searchTerm: string = '') {
    const {
        doctors,
        loading,
        error,
        fetchDashboard,
        toggleDoctorStatus,
        getDoctorById,
        clearError
    } = useDashboardStore();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Filtro que reacciona al searchTerm que viene como parámetro
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

    return {
        doctors: filteredDoctors,
        loading,
        error,

        // Actions
        refetch: fetchDashboard,
        toggleStatus: toggleDoctorStatus,
        getDoctorById,
        clearError,

        // Stats
        activeDoctors: filteredDoctors.filter(d => d.isActive).length,
        totalDoctors: filteredDoctors.length
    };
}