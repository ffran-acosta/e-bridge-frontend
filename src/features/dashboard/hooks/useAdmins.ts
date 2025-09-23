"use client";
import { useEffect, useMemo } from 'react';
import { useDashboardStore } from '../store/dashboard';

export function useAdmins(searchTerm: string = '') {
    // Usar selectores específicos para evitar re-renders innecesarios
    const admins = useDashboardStore(state => state.admins);
    const doctors = useDashboardStore(state => state.doctors);
    const loading = useDashboardStore(state => state.loading);
    const error = useDashboardStore(state => state.error);
    const fetchDashboard = useDashboardStore(state => state.fetchDashboard);
    const toggleAdminStatus = useDashboardStore(state => state.toggleAdminStatus);
    const assignDoctorToAdmin = useDashboardStore(state => state.assignDoctorToAdmin);
    const unassignDoctorFromAdmin = useDashboardStore(state => state.unassignDoctorFromAdmin);
    const getAdminById = useDashboardStore(state => state.getAdminById);
    const clearError = useDashboardStore(state => state.clearError);

    useEffect(() => {
        if (admins.length === 0 && !loading) {
            fetchDashboard();
        }
    }, [admins.length, loading, fetchDashboard]);

    // Filtro memoizado que reacciona al searchTerm
    const filteredAdmins = useMemo(() => {
        return admins.filter(admin => {
            if (searchTerm && searchTerm.trim() !== '') {
                const search = searchTerm.toLowerCase().trim();
                const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
                const email = admin.email.toLowerCase();

                return fullName.includes(search) || email.includes(search);
            }
            return true;
        });
    }, [admins, searchTerm]);

    return {
        admins: filteredAdmins,
        availableDoctors: doctors,
        loading,
        error,

        // Actions
        refetch: fetchDashboard,
        toggleStatus: toggleAdminStatus,
        assignDoctor: assignDoctorToAdmin,
        unassignDoctor: unassignDoctorFromAdmin,
        getAdminById,
        updateFilters: () => { }, // Placeholder
        clearError,

        // Stats
        activeAdmins: filteredAdmins.filter(a => a.isActive).length,
        totalAdmins: filteredAdmins.length,

        // Helpers
        getAdminName: (adminId: string) => {
            const admin = getAdminById(adminId);
            return admin ? `${admin.firstName} ${admin.lastName}` : 'Admin no encontrado';
        },

        getDoctorName: (doctorId: string) => {
            const doctor = doctors.find(d => d.id === doctorId);
            return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor no encontrado';
        }
    };
}