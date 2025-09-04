export const DOCTOR_ENDPOINTS = {
    patients: '/doctor/patients',
    patientProfile: (patientId: string) => `/doctor/patients/patient/${patientId}`,
    patientConsultations: (patientId: string) => `/doctor/patients/${patientId}/consultations`,
    patientAppointments: (patientId: string) => `/doctor/patients/${patientId}/appointments`,
} as const;