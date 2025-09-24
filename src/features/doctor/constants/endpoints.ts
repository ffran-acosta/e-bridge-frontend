export const DOCTOR_ENDPOINTS = {
    patients: '/doctor/patients',
    patientProfile: (patientId: string) => `/doctor/patients/${patientId}`,
    consultations: '/doctor/consultations',
    consultationById: (consultationId: string) => `/doctor/consultations/${consultationId}`,
    deleteConsultation: (consultationId: string) => `/doctor/consultations/${consultationId}`,
    patientConsultations: (patientId: string) => `/doctor/consultations/patients/${patientId}/consultations`,
    siniestro: (siniestroId: string) => `/siniestros/${siniestroId}`,
    // Endpoints específicos para consultas ART
    patientConsultationIngreso: (patientId: string) => `/doctor/consultations/patients/${patientId}/consultations/ingreso`,
    patientConsultationAtencion: (patientId: string) => `/doctor/consultations/patients/${patientId}/consultations/atencion`,
    patientConsultationAlta: (patientId: string) => `/doctor/consultations/patients/${patientId}/consultations/alta`,
    patientNextAllowedConsultations: (patientId: string) => `/doctor/consultations/patients/${patientId}/next-allowed-consultations`,
    patientAppointments: (patientId: string) => `/doctor/appointments/patients/${patientId}`,
    // Endpoints específicos para el calendario de turnos
    appointmentsToday: (date?: string) => 
        date ? `/doctor/appointments/today?date=${date}` : '/doctor/appointments/today',
    appointmentsWeek: (date?: string) => 
        date ? `/doctor/appointments/week?date=${date}` : '/doctor/appointments/week',
    appointmentsMonth: (date?: string) => 
        date ? `/doctor/appointments/month?date=${date}` : '/doctor/appointments/month',
} as const;