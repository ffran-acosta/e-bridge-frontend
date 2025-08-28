"use client";
import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboard';

export function useAdmins(searchTerm: string = '') {
    const {
        admins,
        doctors,
        loading,
        error,
        fetchDashboard,
        toggleAdminStatus,
        assignDoctorToAdmin,
        unassignDoctorFromAdmin,
        getAdminById,
        clearError
    } = useDashboardStore();

    useEffect(() => {
        if (admins.length === 0 && !loading) {
            fetchDashboard();
        }
    }, [admins.length, loading, fetchDashboard]);

    // Filtro que reacciona al searchTerm
    const filteredAdmins = admins.filter(admin => {
        if (searchTerm && searchTerm.trim() !== '') {
            const search = searchTerm.toLowerCase().trim();
            const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
            const email = admin.email.toLowerCase();

            return fullName.includes(search) || email.includes(search);
        }
        return true;
    });

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