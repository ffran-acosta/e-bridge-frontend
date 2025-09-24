export const DOCTOR_ENDPOINTS = {
    patients: '/doctor/patients',
    patientProfile: (patientId: string) => `/doctor/patients/${patientId}`,
    siniestro: (siniestroId: string) => `/siniestros/${siniestroId}`,
    consultations: '/doctor/consultations',
    patientConsultations: (patientId: string) => `/doctor/consultations/patients/${patientId}/consultations`,
    patientAppointments: (patientId: string) => `/doctor/appointments/patients/${patientId}`,
    // Endpoints específicos para el calendario de turnos
    appointmentsToday: (date?: string) => 
        date ? `/doctor/appointments/today?date=${date}` : '/doctor/appointments/today',
    appointmentsWeek: (date?: string) => 
        date ? `/doctor/appointments/week?date=${date}` : '/doctor/appointments/week',
    appointmentsMonth: (date?: string) => 
        date ? `/doctor/appointments/month?date=${date}` : '/doctor/appointments/month',
} as const;