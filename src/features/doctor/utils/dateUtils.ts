/**
 * Utilidades para manejo de fechas en el calendario de turnos
 */

/**
 * Formatea una fecha para usar en los endpoints (YYYY-MM-DD) usando fecha local
 */
export const formatDateForAPI = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
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
 * Obtiene el inicio de la semana (lunes) para una fecha dada
 */
export const getStartOfWeek = (date: Date): Date => {
	const startOfWeek = new Date(date);
	const dayOfWeek = date.getDay();
	// Lunes = 1, Martes = 2, ..., Domingo = 0
	// Si es domingo (0), retroceder 6 días; si no, calcular días hasta lunes (1)
	const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
	startOfWeek.setDate(date.getDate() + daysToMonday);
	startOfWeek.setHours(0, 0, 0, 0);
	return startOfWeek;
};

/**
 * Obtiene el final de la semana (domingo) para una fecha dada
 */
export const getEndOfWeek = (date: Date): Date => {
	const endOfWeek = new Date(date);
	const dayOfWeek = date.getDay();
	const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Si es domingo (0), no avanzar; si no, calcular días hasta domingo
	endOfWeek.setDate(date.getDate() + daysToSunday);
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
 * Genera un array de fechas para un mes completo (incluyendo días del mes anterior y siguiente para completar las semanas)
 */
export const getMonthDates = (date: Date): Date[] => {
	const year = date.getFullYear();
	const month = date.getMonth();
	
	// Obtener el primer día del mes
	const firstDayOfMonth = new Date(year, month, 1);
	
	// Obtener el último día del mes
	const lastDayOfMonth = new Date(year, month + 1, 0);
	
	// Obtener el primer lunes de la semana que contiene el primer día del mes
	const startOfCalendar = getStartOfWeek(firstDayOfMonth);
	
	// Obtener el último domingo de la semana que contiene el último día del mes
	const endOfCalendar = getEndOfWeek(lastDayOfMonth);
	
	const monthDates: Date[] = [];
	
	// Generar todas las fechas desde el primer lunes hasta el último domingo
	const currentDate = new Date(startOfCalendar);
	while (currentDate <= endOfCalendar) {
		monthDates.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
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

