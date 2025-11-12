"use client";

import { useEffect, useCallback } from "react";
import { useDoctorStore } from "../store/doctorStore";

export function usePatientProfile(patientId?: string) {
    // Usar selectores específicos para evitar re-renders innecesarios
    const selectedPatient = useDoctorStore(state => state.selectedPatient);
    const profileLoading = useDoctorStore(state => state.profileLoading);
    const profileError = useDoctorStore(state => state.profileError);
    const fetchPatientProfile = useDoctorStore(state => state.fetchPatientProfile);
    const clearSelectedPatient = useDoctorStore(state => state.clearSelectedPatient);
    const clearProfileError = useDoctorStore(state => state.clearProfileError);

    // Función para refetch memoizada
    const refetch = useCallback(() => {
        if (patientId) {
            return fetchPatientProfile(patientId);
        }
        return Promise.resolve();
    }, [patientId, fetchPatientProfile]);

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

    // Console logs para debug
    console.log('🔍 DEBUG - usePatientProfile:');
    console.log('📋 selectedPatient:', selectedPatient);

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
