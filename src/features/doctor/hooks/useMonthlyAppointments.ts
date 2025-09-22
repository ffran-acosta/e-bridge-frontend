import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { formatDateForAPI } from '../utils/dateUtils';
import type { BackendCalendarApiResponse } from '@/shared/types/patients.types';

interface MonthlyAppointmentsState {
    appointments: BackendCalendarApiResponse['data']['data']['appointments'];
    loading: boolean;
    error: string | null;
    currentDate: Date;
}

interface MonthlyAppointmentsActions {
    fetchAppointments: (date: Date) => Promise<void>;
    setCurrentDate: (date: Date) => void;
    clearError: () => void;
}

export const useMonthlyAppointments = () => {
    const [state, setState] = useState<MonthlyAppointmentsState>({
        appointments: [],
        loading: false,
        error: null,
        currentDate: new Date(),
    });

    const fetchAppointments = async (date: Date) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const dateStr = formatDateForAPI(date);
            const endpoint = DOCTOR_ENDPOINTS.appointmentsMonth(dateStr);

            console.log('🌐 Fetching monthly appointments:', {
                date: dateStr,
                endpoint,
            });

            const response = await api<BackendCalendarApiResponse>(endpoint);

            if (response.success) {
                const appointmentsData = response.data.data;
                console.log('📅 Monthly appointments response:', {
                    date: appointmentsData.date,
                    count: appointmentsData.count,
                    appointments: appointmentsData.appointments.slice(0, 5),
                });

                setState(prev => ({
                    ...prev,
                    appointments: appointmentsData.appointments,
                    loading: false,
                    error: null,
                    currentDate: date,
                }));
            } else {
                throw new Error('Error al obtener los turnos del mes');
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error desconocido al cargar los turnos del mes';

            console.error('❌ Error fetching monthly appointments:', error);

            setState(prev => ({
                ...prev,
                appointments: [],
                loading: false,
                error: errorMessage,
            }));
        }
    };

    const setCurrentDate = (date: Date) => {
        setState(prev => ({ ...prev, currentDate: date }));
        fetchAppointments(date);
    };

    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchAppointments(state.currentDate);
    }, []);

    return {
        appointments: state.appointments,
        loading: state.loading,
        error: state.error,
        currentDate: state.currentDate,
        fetchAppointments,
        setCurrentDate,
        clearError,
        refetch: () => fetchAppointments(state.currentDate),
    };
};
