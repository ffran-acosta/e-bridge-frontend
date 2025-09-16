"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import { Patient, PatientsParams, PatientsResponse, PatientProfile, PatientProfileResponse, BackendPatientsResponse, BackendPatientProfileResponse } from "@/shared/types/patients.types";
import { DOCTOR_ENDPOINTS } from "../constants/endpoints";
import { mapBackendPatientToFrontend, mapBackendPatientProfileToFrontend } from "../utils/patientMappers";

type State = {
    // Estado existente de pacientes (lista)
    patients: Patient[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    loading: boolean;
    error: string | null;
    searchTerm: string;
    sortBy: string | undefined;

    // Estado para perfil del paciente
    selectedPatient: PatientProfile | null;
    profileLoading: boolean;
    profileError: string | null;

    // Estado para impersonación (admin viendo doctor)
    impersonatedDoctorId: string | null;
    isImpersonating: boolean;
};

type Actions = {
    // Acciones existentes para lista de pacientes
    fetchPatients: (params?: PatientsParams) => Promise<void>;
    setSearchTerm: (term: string) => void;
    setSortBy: (sortBy: string | undefined) => void;
    setPage: (page: number) => void;
    clearError: () => void;
    reset: () => void;
    refetch: () => Promise<void>;

    // Acciones para perfil del paciente
    fetchPatientProfile: (patientId: string) => Promise<void>;
    clearSelectedPatient: () => void;
    clearProfileError: () => void;

    // Acciones para impersonación
    setImpersonatedDoctor: (doctorId: string | null) => void;
    clearImpersonation: () => void;
};

const initialState: State = {
    // Estado inicial existente
    patients: [],
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },
    loading: false,
    error: null,
    searchTerm: "",
    sortBy: undefined,

    // Estado inicial del perfil
    selectedPatient: null,
    profileLoading: false,
    profileError: null,

    // Estado inicial de impersonación
    impersonatedDoctorId: null,
    isImpersonating: false,
};

export const useDoctorStore = create<State & Actions>((set, get) => ({
    ...initialState,

    // ========== ACCIONES EXISTENTES ==========
    fetchPatients: async (params) => {
        set({ loading: true, error: null });

        try {
            const queryParams = new URLSearchParams();
            const currentState = get();
            const page = params?.page ?? currentState.pagination.page;
            const limit = params?.limit ?? currentState.pagination.limit;
            const sortBy = params?.sortBy ?? currentState.sortBy;

            queryParams.set('page', page.toString());
            queryParams.set('limit', limit.toString());

            if (sortBy) {
                queryParams.set('sortBy', sortBy);
            }

            // Si estamos impersonando, agregar el doctorId como query param
            if (currentState.isImpersonating && currentState.impersonatedDoctorId) {
                queryParams.set('doctorId', currentState.impersonatedDoctorId);
            }

            const response = await api<BackendPatientsResponse>(
                `${DOCTOR_ENDPOINTS.patients}?${queryParams.toString()}`
            );

            // Mapear los pacientes del backend al formato del frontend
            const mappedPatients = response.data.data.map(mapBackendPatientToFrontend);

            set({
                patients: mappedPatients,
                pagination: response.data.pagination,
                loading: false,
            });
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Error al cargar pacientes',
            });
        }
    },

    refetch: async () => {
        const currentState = get();
        await get().fetchPatients({
            page: currentState.pagination.page,
            sortBy: currentState.sortBy
        });
    },

    setSearchTerm: (term) => set({ searchTerm: term }),

    setSortBy: (sortBy) => {
        set({ sortBy });
        get().fetchPatients({ sortBy, page: 1 });
    },

    setPage: (page) => {
        const currentState = get();
        set({ pagination: { ...currentState.pagination, page } });
        get().fetchPatients({ page });
    },

    clearError: () => set({ error: null }),

    reset: () => set(initialState),

    // ========== ACCIONES PARA PERFIL ==========
    fetchPatientProfile: async (patientId: string) => {
        set({ profileLoading: true, profileError: null });

        try {
            const currentState = get();
            let endpoint = DOCTOR_ENDPOINTS.patientProfile(patientId);
            
            // Si estamos impersonando, agregar el doctorId como query param
            if (currentState.isImpersonating && currentState.impersonatedDoctorId) {
                endpoint += `?doctorId=${currentState.impersonatedDoctorId}`;
            }

            const response = await api<BackendPatientProfileResponse>(endpoint);

            // Mapear el perfil del backend al formato del frontend
            const mappedProfile = mapBackendPatientProfileToFrontend(response.data.data);

            set({
                selectedPatient: mappedProfile,
                profileLoading: false,
            });
        } catch (error) {
            set({
                profileLoading: false,
                profileError: error instanceof Error ? error.message : 'Error al cargar perfil del paciente',
                selectedPatient: null,
            });
        }
    },

    clearSelectedPatient: () => set({ selectedPatient: null }),
    clearProfileError: () => set({ profileError: null }),

    // ========== ACCIONES PARA IMPERSONACIÓN ==========
    setImpersonatedDoctor: (doctorId: string | null) => {
        set({ 
            impersonatedDoctorId: doctorId,
            isImpersonating: !!doctorId
        });
    },

    clearImpersonation: () => {
        set({ 
            impersonatedDoctorId: null,
            isImpersonating: false
        });
    },
}));