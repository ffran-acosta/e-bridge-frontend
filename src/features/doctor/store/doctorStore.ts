"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import { Patient, PatientsParams, PatientsResponse, PatientProfile, PatientProfileResponse } from "@/shared/types/patients.types";
import { DOCTOR_ENDPOINTS } from "../constants/endpoints";

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

            const response = await api<PatientsResponse>(
                `${DOCTOR_ENDPOINTS.patients}?${queryParams.toString()}`
            );

            set({
                patients: response.data.patients,
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
            const response = await api<PatientProfileResponse>(
                DOCTOR_ENDPOINTS.patientProfile(patientId)
            );

            set({
                selectedPatient: response.data,
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
}));