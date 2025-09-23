// Utilidades para formateo de fechas y horas

// ========== FUNCIONES GENERALES DE FECHAS ==========

// Formatear fecha y hora completa
export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';

    return new Date(dateString).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Formatear solo fecha
export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';

    return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Formatear solo hora
export const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';

    return new Date(dateString).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Formatear última consulta específicamente
export const formatLastConsultation = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Sin consultas';

    return formatDateTime(dateString);
};

// ========== FUNCIONES PARA CONSULTAS ==========

// Formatea la fecha de consulta
export const formatConsultationDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha no válida';
    }
};

// Formatea la fecha de próxima cita
export const formatNextAppointmentDate = (dateString: string | null): string => {
    if (!dateString) return 'No programada';

    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha no válida';
    }
};

// ========== FUNCIONES PARA TURNOS ==========

// Formatea la fecha y hora del turno
export const formatAppointmentDateTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha no válida';
    }
};

// Formatea solo la fecha del turno
export const formatAppointmentDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return 'Fecha no válida';
    }
};

// Formatea solo la hora del turno
export const formatAppointmentTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Hora no válida';
    }
};
