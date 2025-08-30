"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import { LoginInput, RegisterDoctorInput, RegisterAdminInput } from "../lib/schemas";
import { User } from "../../types/auth";

type ApiResponse<T = any> = {
    statusCode: number;
    message: string;
    data?: T;
};

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let refreshTimer: NodeJS.Timeout | null = null;

type State = {
    user: User | null;
    loading: boolean;
    isInitialized: boolean;
};

type Actions = {
    // Métodos principales
    login: (data: LoginInput) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
    refresh: () => Promise<void>;
    initialize: () => Promise<void>;

    registerDoctor: (data: RegisterDoctorInput) => Promise<void>;
    registerAdmin: (data: RegisterAdminInput) => Promise<void>;

    setUser: (user: User | null) => void;
    clearAuth: () => void;

    apiWithAuth: <T>(path: string, opts?: any) => Promise<T>;
};

const scheduleTokenRefresh = (get: () => State & Actions) => {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
    }

    // Renovar a los 13 minutos (2 min antes de expirar)
    refreshTimer = setTimeout(async () => {
        try {
            await get().refresh();
            // Programar próximo refresh
            scheduleTokenRefresh(get);
        } catch (error) {
            console.warn('Auto-refresh falló:', error);
            get().clearAuth();
        }
    }, 13 * 60 * 1000); // 13 minutos
};

export const useAuthStore = create<State & Actions>((set, get) => ({
    user: null,
    loading: false,
    isInitialized: false,

    // Helper para limpiar estado
    clearAuth: () => {
        if (refreshTimer) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }
        set({ user: null });
    },

    // Helper para establecer usuario
    setUser: (user) => set({ user }),

    apiWithAuth: async <T>(path: string, opts: any = {}): Promise<T> => {
        try {
            return await api<T>(path, opts);
        } catch (error) {
            // Si es error 401 y no estamos haciendo refresh
            if (error instanceof Error && error.message.includes('401') && !isRefreshing) {
                try {
                    // Evitar múltiples refresh simultáneos
                    if (!refreshPromise) {
                        isRefreshing = true;
                        refreshPromise = get().refresh();
                    }

                    await refreshPromise;

                    // Reintentar la request original
                    return await api<T>(path, opts);

                } catch (refreshError) {
                    // Si falla el refresh, logout automático
                    console.warn("Refresh falló, cerrando sesión");
                    get().clearAuth();
                    throw refreshError;
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            }

            throw error;
        }
    },

    // Inicializar - verificar si hay sesión activa
    initialize: async () => {
        if (get().isInitialized) return;

        set({ loading: true });
        try {
            await get().getCurrentUser();
            // Si hay usuario al inicializar, programar refresh
            if (get().user) {
                scheduleTokenRefresh(get);
            }
        } catch (error) {
            // Si falla, el usuario no está autenticado
            console.log("No hay sesión activa");
        } finally {
            set({ loading: false, isInitialized: true });
        }
    },

    // Obtener datos del usuario actual
    getCurrentUser: async () => {
        try {
            const response = await api<ApiResponse>("/auth/me");
            const userData = response?.data?.data;

            set({ user: userData || null });
        } catch (error) {
            // Si falla, limpiar estado
            set({ user: null });
            throw error;
        }
    },

    // Login - ahora solo establece cookies, luego obtiene user
    login: async (data) => {
        set({ loading: true });
        try {
            // 1. Login establece cookies
            await api<ApiResponse>("/auth/login", {
                method: "POST",
                body: data,
            });

            // 2. Obtener datos del usuario
            await get().getCurrentUser();

            // 3. Programar auto-refresh
            scheduleTokenRefresh(get);
        } finally {
            set({ loading: false });
        }
    },

    // Refresh tokens
    refresh: async () => {
        try {
            await api<ApiResponse>("/auth/refresh", {
                method: "POST",
            });
            // Después del refresh, obtener usuario actualizado
            await get().getCurrentUser();
        } catch (error) {
            // Si falla el refresh, limpiar sesión
            get().clearAuth();
            throw error;
        }
    },

    // Logout
    logout: async () => {
        set({ loading: true });

        // Limpiar timer antes de hacer logout
        if (refreshTimer) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }

        try {
            await api<ApiResponse>("/auth/logout", {
                method: "POST",
            });
        } catch (error) {
            // Incluso si falla el logout en el server, limpiar localmente
            console.warn("Error en logout:", error);
        } finally {
            set({ user: null, loading: false });
        }
    },

    // Registro de doctor
    registerDoctor: async (data) => {
        set({ loading: true });
        try {
            await api<ApiResponse>("/auth/register/doctor", {
                method: "POST",
                body: data,
            });
        } finally {
            set({ loading: false });
        }
    },

    // Registro de admin
    registerAdmin: async (data) => {
        set({ loading: true });
        try {
            await api<ApiResponse>("/auth/register/admin", {
                method: "POST",
                body: data,
            });
        } finally {
            set({ loading: false });
        }
    },
}));