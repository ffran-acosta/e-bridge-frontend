/**
 * Utilidades para manejo de fechas en el calendario de turnos
 */

/**
 * Formatea una fecha para usar en los endpoints (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Obtiene el día anterior
 */
export const getPreviousDay = (date: Date): Date => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    return previousDay;
};

/**
 * Obtiene el día siguiente
 */
export const getNextDay = (date: Date): Date => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay;
};

/**
 * Obtiene el inicio de la semana (domingo) para una fecha dada
 */
export const getStartOfWeek = (date: Date): Date => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
};

/**
 * Obtiene el final de la semana (sábado) para una fecha dada
 */
export const getEndOfWeek = (date: Date): Date => {
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
};

/**
 * Obtiene la semana anterior
 */
export const getPreviousWeek = (date: Date): Date => {
    const previousWeek = new Date(date);
    previousWeek.setDate(date.getDate() - 7);
    return previousWeek;
};

/**
 * Obtiene la semana siguiente
 */
export const getNextWeek = (date: Date): Date => {
    const nextWeek = new Date(date);
    nextWeek.setDate(date.getDate() + 7);
    return nextWeek;
};

/**
 * Obtiene el inicio del mes para una fecha dada
 */
export const getStartOfMonth = (date: Date): Date => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    return startOfMonth;
};

/**
 * Obtiene el final del mes para una fecha dada
 */
export const getEndOfMonth = (date: Date): Date => {
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return endOfMonth;
};

/**
 * Obtiene el mes anterior
 */
export const getPreviousMonth = (date: Date): Date => {
    const previousMonth = new Date(date);
    previousMonth.setMonth(date.getMonth() - 1);
    return previousMonth;
};

/**
 * Obtiene el mes siguiente
 */
export const getNextMonth = (date: Date): Date => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(date.getMonth() + 1);
    return nextMonth;
};

/**
 * Verifica si una fecha es hoy
 */
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

/**
 * Verifica si una fecha está en la semana actual
 */
export const isCurrentWeek = (date: Date): boolean => {
    const today = new Date();
    const startOfCurrentWeek = getStartOfWeek(today);
    const endOfCurrentWeek = getEndOfWeek(today);
    
    return date >= startOfCurrentWeek && date <= endOfCurrentWeek;
};

/**
 * Verifica si una fecha está en el mes actual
 */
export const isCurrentMonth = (date: Date): boolean => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && 
           date.getMonth() === today.getMonth();
};

/**
 * Obtiene el nombre del día de la semana en español
 */
export const getDayName = (date: Date): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
};

/**
 * Obtiene el nombre del mes en español
 */
export const getMonthName = (date: Date): string => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()];
};

/**
 * Obtiene el nombre corto del día de la semana en español
 */
export const getShortDayName = (date: Date): string => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
};

/**
 * Genera un array de fechas para una semana completa
 */
export const getWeekDates = (date: Date): Date[] => {
    const startOfWeek = getStartOfWeek(date);
    const weekDates: Date[] = [];
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        weekDates.push(day);
    }
    
    return weekDates;
};

/**
 * Genera un array de fechas para un mes completo
 */
export const getMonthDates = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthDates: Date[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        monthDates.push(new Date(year, month, day));
    }
    
    return monthDates;
};

/**
 * Obtiene el número de días en un mes
 */
export const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Obtiene el primer día del mes (para mostrar en el calendario mensual)
 */
export const getFirstDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Obtiene el último día del mes (para mostrar en el calendario mensual)
 */
export const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

