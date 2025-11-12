"use client";

import { useEffect, useCallback } from "react";
import { useDoctorStore } from "../store/doctorStore";
import { PatientsParams } from "@/shared/types/patients.types";

export function useDoctorPatients(initialParams?: PatientsParams) {
    // Usar selectores específicos para evitar re-renders innecesarios
    const patients = useDoctorStore(state => state.patients);
    const pagination = useDoctorStore(state => state.pagination);
    const loading = useDoctorStore(state => state.loading);
    const error = useDoctorStore(state => state.error);
    const searchTerm = useDoctorStore(state => state.searchTerm);
    const sortBy = useDoctorStore(state => state.sortBy);
    const patientType = useDoctorStore(state => state.patientType);
    
    // Actions
    const fetchPatients = useDoctorStore(state => state.fetchPatients);
    const setSearchTerm = useDoctorStore(state => state.setSearchTerm);
    const setSortBy = useDoctorStore(state => state.setSortBy);
    const setPatientType = useDoctorStore(state => state.setPatientType);
    const setPage = useDoctorStore(state => state.setPage);
    const clearError = useDoctorStore(state => state.clearError);

    // Fetch inicial
    useEffect(() => {
        fetchPatients(initialParams);
    }, [fetchPatients, initialParams]);

    // Función para refetch con parámetros específicos memoizada
    const refetch = useCallback((params?: PatientsParams) => {
        return fetchPatients(params);
    }, [fetchPatients]);

    return {
        // Estado
        patients,
        pagination,
        loading,
        error,
        searchTerm,
        sortBy,
        patientType,

        // Acciones
        refetch,
        setSearchTerm,
        setSortBy,
        setPatientType,
        setPage,
        clearError,
    };
}