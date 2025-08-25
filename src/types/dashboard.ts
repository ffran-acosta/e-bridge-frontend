export interface BackendUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive?: boolean;
}

export interface BackendSpecialty {
    id: string;
    name: string;
    code: string;
}

export interface BackendDoctor {
    id: string;
    userId: string;
    licenseNumber: string;
    specialtyId: string;
    user: BackendUser;
    specialty: BackendSpecialty;
    _count: {
        adminLinks: number;
    };
}

export interface BackendAdmin {
    id: string;
    userId: string;
    isActive: boolean;
    user: BackendUser;
    assignedDoctors: BackendDoctor[];
    _count: {
        doctorLinks: number;
    };
}

export interface BackendStats {
    totalDoctors: number;
    activeDoctors: number;
    inactiveDoctors: number;
    totalAdmins: number;
    activeAdmins: number;
    inactiveAdmins: number;
    totalPatients: number;
    totalAssignments: number;
}

export interface DashboardResponse {
    stats: BackendStats;
    doctors: BackendDoctor[];
    admins: BackendAdmin[];
}

// Tipos transformados para el frontend (más simples)
export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    licenseNumber: string;
    specialty: {
        id: string;
        name: string;
    };
    assignedAdminsCount: number;
}

export interface Admin {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    assignedDoctors: string[];
    assignedDoctorsCount: number;
}

export interface DashboardStats {
    activeDoctors: number;
    activeAdmins: number;
    totalPatients: number;
    totalAssignments: number;
}

// Tipos para filtros y búsquedas
export interface DoctorFilters {
    search?: string;
    specialty?: string;
    isActive?: boolean;
    adminId?: string;
}

export interface AdminFilters {
    search?: string;
    isActive?: boolean;
}