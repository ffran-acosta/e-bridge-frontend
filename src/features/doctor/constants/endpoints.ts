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
    patientConsultationReingreso: (patientId: string) => `/doctor/consultations/patients/${patientId}/consultations/reingreso`,
    patientNextAllowedConsultations: (patientId: string) => `/doctor/consultations/patients/${patientId}/next-allowed-consultations`,
    
    // Endpoints para consultas básicas (pacientes normales)
    patientBasicConsultation: '/doctor/consultations',
    appointments: '/doctor/appointments',
    patientAppointments: (patientId: string) => `/doctor/appointments/patients/${patientId}`,
    deleteAppointment: (appointmentId: string) => `/doctor/appointments/${appointmentId}`,
    cancelAppointment: (appointmentId: string) => `/doctor/appointments/${appointmentId}/cancel`,
    completeAppointment: (appointmentId: string) => `/doctor/appointments/${appointmentId}/complete`,
    updateAppointment: (appointmentId: string) => `/doctor/appointments/${appointmentId}`,
    // Endpoints específicos para el calendario de turnos
    appointmentsToday: (date?: string) => 
        date ? `/doctor/appointments/today?date=${date}` : '/doctor/appointments/today',
    appointmentsWeek: (date?: string) => 
        date ? `/doctor/appointments/week?date=${date}` : '/doctor/appointments/week',
    appointmentsMonth: (date?: string) => 
        date ? `/doctor/appointments/month?date=${date}` : '/doctor/appointments/month',
    exportList: '/doctor/consultations/export-list',
    // Endpoints del validador
    validateEligibility: '/integrations/avalian/elegibilidad',
    listTransactions: '/integrations/avalian/transacciones',
    authorize: '/doctor/validator/authorize',
    cancelTransaction: (transactionNumber: string) => `/doctor/validator/transactions/${transactionNumber}/cancel`,
    recoverAuthorization: (authorizationNumber: string) => `/doctor/validator/authorizations/${authorizationNumber}`,
    listAuthorizations: (dni?: string) => dni ? `/doctor/validator/authorizations?dni=${dni}` : '/doctor/validator/authorizations',
} as const;