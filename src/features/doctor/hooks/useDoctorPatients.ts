"use client";

import { useEffect } from "react";
import { useDoctorStore } from "../store/doctorStore";
import { PatientsParams } from "@/shared/types/patients.types"; // 

export function useDoctorPatients(initialParams?: PatientsParams) {
    const {
        patients,
        pagination,
        loading,
        error,
        searchTerm,
        sortBy,
        patientType,
        fetchPatients,
        setSearchTerm,
        setSortBy,
        setPatientType,
        setPage,
        clearError,
    } = useDoctorStore();

    // Fetch inicial
    useEffect(() => {
        fetchPatients(initialParams);
    }, []); // Solo en mount

    // Función para refetch con parámetros específicos
    const refetch = (params?: PatientsParams) => {
        return fetchPatients(params);
    };

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