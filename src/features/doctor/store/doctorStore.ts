"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import { Patient, PatientsParams, PatientProfile, BackendPatientsResponse, BackendPatientProfileResponse } from "@/shared/types/patients.types";
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
    patientType: 'NORMAL' | 'ART';

    // Estado para perfil del paciente
    selectedPatient: PatientProfile | null;
    profileLoading: boolean;
    profileError: string | null;

    // Estado para impersonación (admin viendo doctor)
    impersonatedDoctorId: string | null;
    impersonatedDoctorName: string | null;
    isImpersonating: boolean;
};

type Actions = {
    // Acciones existentes para lista de pacientes
    fetchPatients: (params?: PatientsParams) => Promise<void>;
    setSearchTerm: (term: string) => void;
    setSortBy: (sortBy: string | undefined) => void;
    setPatientType: (type: 'NORMAL' | 'ART') => void;
    setPage: (page: number) => void;
    clearError: () => void;
    reset: () => void;
    refetch: () => Promise<void>;

    // Acciones para perfil del paciente
    fetchPatientProfile: (patientId: string) => Promise<void>;
    clearSelectedPatient: () => void;
    clearProfileError: () => void;

    // Acciones para impersonación
    setImpersonatedDoctor: (doctorId: string | null, doctorName?: string | null) => void;
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
    patientType: 'ART',

    // Estado inicial del perfil
    selectedPatient: null,
    profileLoading: false,
    profileError: null,

    // Estado inicial de impersonación
    impersonatedDoctorId: null,
    impersonatedDoctorName: null,
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
            const patientType = currentState.patientType;

            queryParams.set('page', page.toString());
            queryParams.set('limit', limit.toString());
            queryParams.set('type', patientType);

            if (sortBy) {
                queryParams.set('sortBy', sortBy);
            }

            // Si estamos impersonando, enviar el doctorId como header
            // El backend está configurado para aceptar X-Doctor-Id en CORS
            const headers: Record<string, string> = {};
            if (currentState.isImpersonating && currentState.impersonatedDoctorId) {
                headers['X-Doctor-Id'] = currentState.impersonatedDoctorId;
            }

            const response = await api<BackendPatientsResponse>(
                `${DOCTOR_ENDPOINTS.patients}?${queryParams.toString()}`,
                Object.keys(headers).length > 0 ? { headers } : {}
            );

            if (!response || !response.data) {
                throw new Error('Sin respuesta del servidor al obtener pacientes');
            }

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
        const currentState = get();
        set({ 
            sortBy,
            pagination: { ...currentState.pagination, page: 1 }
        });
        get().fetchPatients({ sortBy, page: 1 });
    },

    setPatientType: (patientType) => {
        const currentState = get();
        set({ 
            patientType,
            pagination: { ...currentState.pagination, page: 1 }
        });
        get().fetchPatients({ page: 1 });
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
            const endpoint = DOCTOR_ENDPOINTS.patientProfile(patientId);
            
            // Si estamos impersonando, enviar el doctorId como header
            // El backend está configurado para aceptar X-Doctor-Id en CORS
            const headers: Record<string, string> = {};
            if (currentState.isImpersonating && currentState.impersonatedDoctorId) {
                headers['X-Doctor-Id'] = currentState.impersonatedDoctorId;
            }

            const response = await api<BackendPatientProfileResponse>(
                endpoint,
                Object.keys(headers).length > 0 ? { headers } : {}
            );

            if (!response || !response.data) {
                throw new Error('Sin respuesta del servidor al obtener el perfil del paciente');
            }

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
    setImpersonatedDoctor: (doctorId: string | null, doctorName?: string | null) => {
        set({ 
            impersonatedDoctorId: doctorId,
            impersonatedDoctorName: doctorName || null,
            isImpersonating: !!doctorId
        });
    },

    clearImpersonation: () => {
        set({ 
            impersonatedDoctorId: null,
            impersonatedDoctorName: null,
            isImpersonating: false
        });
    },
}));