"use client";

import { useEffect } from "react";
import { useDoctorStore } from "../store/doctorStore";

export function usePatientProfile(patientId?: string) {
    const {
        selectedPatient,
        profileLoading,
        profileError,
        fetchPatientProfile,
        clearSelectedPatient,
        clearProfileError,
    } = useDoctorStore();

    // Fetch inicial cuando se proporciona patientId
    useEffect(() => {
        if (patientId) {
            fetchPatientProfile(patientId);
        }

        // Cleanup al desmontar o cambiar patientId
        return () => {
            clearSelectedPatient();
        };
    }, [patientId, fetchPatientProfile, clearSelectedPatient]);

    // Función para refetch
    const refetch = () => {
        if (patientId) {
            return fetchPatientProfile(patientId);
        }
        return Promise.resolve();
    };

    return {
        // Estado
        patient: selectedPatient,
        loading: profileLoading,
        error: profileError,

        // Acciones
        refetch,
        clearError: clearProfileError,
        clearPatient: clearSelectedPatient,
    };
}
