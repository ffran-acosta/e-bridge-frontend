import { create } from "zustand";
import { api } from "@/lib/api";
import type { LoginInput, RegisterAdminInput, RegisterDoctorInput } from "@/lib/schemas";
import type { LoginResponse, User } from "@/types/auth";

type State = {
    user: User | null;
    loading: boolean;
};

type Actions = {
    login: (data: LoginInput) => Promise<void>;
    registerDoctor: (data: RegisterDoctorInput) => Promise<void>;
    registerAdmin: (data: RegisterAdminInput) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (u: User | null) => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
    user: null,
    loading: false,

    setUser: (u) => set({ user: u }),

    login: async (data) => {
        set({ loading: true });
        try {
            const res = await api<LoginResponse>("/auth/login", {
                method: "POST",
                body: data,
            });
            set({ user: res.user });
        } finally {
            set({ loading: false });
        }
    },

    registerDoctor: async (data) => {
        set({ loading: true });
        try {
            await api("/auth/register/doctor", { method: "POST", body: data });
        } finally {
            set({ loading: false });
        }
    },

    registerAdmin: async (data) => {
        set({ loading: true });
        try {
            await api("/auth/register/admin", { method: "POST", body: data });
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await api("/auth/logout", { method: "POST" });
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
}));
