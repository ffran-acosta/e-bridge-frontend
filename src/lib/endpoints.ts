export const ENDPOINTS = {
    // Auth 
    auth: {
        login: '/auth/login',
        me: '/auth/me',
        logout: '/auth/logout'
    },

    // Super Admin endpoints
    superAdmin: {
        dashboard: '/super-admin/dashboard',
        stats: '/super-admin/dashboard/stats',
        doctors: '/super-admin/doctors',
        admins: '/super-admin/admins',
        toggleDoctorStatus: (id: string) => `/super-admin/doctors/${id}/status`,
        toggleAdminStatus: (id: string) => `/super-admin/admins/${id}/status`,
        assignDoctors: (adminId: string) => `/super-admin/admins/${adminId}/assign-doctors`,
        removeDoctorFromAdmin: (adminId: string, doctorId: string) => `/super-admin/admins/${adminId}/doctors/${doctorId}`,
        availableDoctors: (adminId: string) => `/super-admin/admins/${adminId}/available-doctors`
    }
} as const;