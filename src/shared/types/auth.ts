// Roles que coinciden con el backend
export type Role = "SUPER_ADMIN" | "ADMIN" | "DOCTOR";

export type Doctor = {
    id: string;
    licenseNumber: string;
    province: string;
    specialty: {
        id: string;
        name: string;
    };
};

export type Admin = {
    id: string;
};

// Usuario principal
export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;

    doctor?: Doctor | null;
    admin?: Admin | null;
};

// Helper para obtener nombre completo
export const getFullName = (user: User): string => {
    return `${user.firstName} ${user.lastName}`.trim();
};

// Helper para verificar roles
export const isDoctor = (user: User): user is User & { doctor: Doctor } => {
    return user.role === "DOCTOR" && !!user.doctor;
};

export const isAdmin = (user: User): user is User & { admin: Admin } => {
    return user.role === "ADMIN" && !!user.admin;
};

export const isSuperAdmin = (user: User): boolean => {
    return user.role === "SUPER_ADMIN";
};

// Tipos para permisos (opcional)
export type Permission =
    | "manage_users"
    | "manage_patients"
    | "view_reports"
    | "admin_panel";

export const getUserPermissions = (user: User): Permission[] => {
    switch (user.role) {
        case "SUPER_ADMIN":
            return ["manage_users", "manage_patients", "view_reports", "admin_panel"];
        case "ADMIN":
            return ["manage_patients", "view_reports"];
        case "DOCTOR":
            return ["manage_patients", "view_reports"];
        default:
            return [];
    }
};