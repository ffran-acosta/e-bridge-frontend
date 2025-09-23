"use client";
import { useEffect, useMemo } from 'react';
import { useDashboardStore } from '../store/dashboard';

export function useDoctors(searchTerm: string = '') {
    // Usar selectores específicos para evitar re-renders innecesarios
    const doctors = useDashboardStore(state => state.doctors);
    const loading = useDashboardStore(state => state.loading);
    const error = useDashboardStore(state => state.error);
    const fetchDashboard = useDashboardStore(state => state.fetchDashboard);
    const toggleDoctorStatus = useDashboardStore(state => state.toggleDoctorStatus);
    const getDoctorById = useDashboardStore(state => state.getDoctorById);
    const clearError = useDashboardStore(state => state.clearError);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Filtro memoizado que reacciona al searchTerm que viene como parámetro
    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
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
    }, [doctors, searchTerm]);

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