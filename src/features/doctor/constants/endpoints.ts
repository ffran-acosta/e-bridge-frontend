export const DOCTOR_ENDPOINTS = {
    patients: '/doctor/patients',
    patientProfile: (patientId: string) => `/doctor/patients/${patientId}`,
    consultations: '/doctor/consultations',
    patientAppointments: (patientId: string) => `/doctor/patients/${patientId}/appointments`,
} as const;