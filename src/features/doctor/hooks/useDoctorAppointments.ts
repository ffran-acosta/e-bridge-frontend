// features/doctor/hooks/useDoctorAppointments.ts
import { useEffect } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';
import { formatDateForAPI } from '../utils/dateUtils';
import type {
    Appointment,
    BackendCalendarAppointment,
    BackendCalendarApiResponse,
} from '@/shared/types/patients.types';

type CalendarView = 'daily' | 'weekly' | 'monthly';

interface DoctorAppointmentsState {
    appointments: Appointment[];
    loading: boolean;
    error: string | null;
    currentView: CalendarView;
    currentDate: Date;
}

interface DoctorAppointmentsActions {
    fetchAppointments: (view: CalendarView, date: Date) => Promise<void>;
    clearAppointments: () => void;
    setError: (error: string | null) => void;
    setCurrentView: (view: CalendarView) => void;
    setCurrentDate: (date: Date) => void;
}

type DoctorAppointmentsStore = DoctorAppointmentsState & DoctorAppointmentsActions;

const initialState: DoctorAppointmentsState = {
    appointments: [],
    loading: false,
    error: null,
    currentView: 'daily',
    currentDate: new Date(),
};

    // Función para mapear datos del calendario del backend al formato del frontend
const mapCalendarAppointmentToFrontend = (calendarAppointment: BackendCalendarAppointment, periodDate: string, view: CalendarView): Appointment => {
    // Siempre usar la fecha real del turno del backend
    const appointmentDate = calendarAppointment.date;
    
    // Crear fecha completa combinando la fecha con la hora en formato ISO
    // El backend envía la hora en formato "HH:MM", necesitamos crear un datetime completo
    const scheduledDateTime = `${appointmentDate}T${calendarAppointment.time}:00`;
    
    return {
        id: calendarAppointment.id,
        scheduledDateTime: scheduledDateTime,
        status: calendarAppointment.status,
        notes: '', // No viene en la respuesta del calendario
        patient: {
            id: calendarAppointment.patientId, // Ahora viene del backend
            fullName: calendarAppointment.patient,
            dni: calendarAppointment.dni,
            age: 0, // No viene en la respuesta del calendario
        },
        medicalEstablishment: {
            id: '', // No viene en la respuesta del calendario
            name: '', // No viene en la respuesta del calendario
            cuit: '', // No viene en la respuesta del calendario
        },
        hasOriginConsultation: false, // No viene en la respuesta del calendario
        hasCompletedConsultation: calendarAppointment.status === 'COMPLETED',
        createdAt: '', // No viene en la respuesta del calendario
        updatedAt: '', // No viene en la respuesta del calendario
    };
};

const useDoctorAppointmentsStore = create<DoctorAppointmentsStore>()(
    devtools(
        (set, get) => ({
            ...initialState,

            fetchAppointments: async (view: CalendarView, date: Date) => {
                const { loading } = get();

                if (loading) return;

                set({ loading: true, error: null, currentView: view, currentDate: date });

                try {
                    let endpoint: string;
                    const dateStr = formatDateForAPI(date);
                    
                    switch (view) {
                        case 'daily':
                            endpoint = DOCTOR_ENDPOINTS.appointmentsToday(dateStr);
                            break;
                        case 'weekly':
                            endpoint = DOCTOR_ENDPOINTS.appointmentsWeek(dateStr);
                            break;
                        case 'monthly':
                            endpoint = DOCTOR_ENDPOINTS.appointmentsMonth(dateStr);
                            break;
                        default:
                            throw new Error('Vista de calendario no válida');
                    }

                    console.log('🌐 Making API call:', {
                        view,
                        dateStr,
                        endpoint,
                        fullUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${endpoint}`
                    });

                    const response = await api<BackendCalendarApiResponse>(endpoint);

                    if (!response || !response.data) {
                        throw new Error('Sin respuesta del servidor al obtener turnos');
                    }

                    if (response.success) {
                        const calendarData = response.data.data;

                        if (!calendarData) {
                            throw new Error('Datos de turnos no disponibles');
                        }
                        console.log('📅 Backend response:', {
                            view,
                            date: calendarData.date,
                            count: calendarData.count,
                            appointments: calendarData.appointments.slice(0, 3)
                        });
                        
                        const mappedAppointments = calendarData.appointments.map(appointment => 
                            mapCalendarAppointmentToFrontend(appointment, calendarData.date, view)
                        );
                        
                        console.log('🔄 Mapped appointments:', {
                            count: mappedAppointments.length,
                            appointments: mappedAppointments.slice(0, 3).map(a => ({
                                id: a.id,
                                scheduledDateTime: a.scheduledDateTime,
                                patient: a.patient.fullName
                            }))
                        });
                        
                        set({
                            appointments: mappedAppointments,
                            loading: false,
                            error: null,
                        });
                    } else {
                        throw new Error('Error al obtener los turnos');
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'Error desconocido al cargar los turnos';

                    set({
                        appointments: [],
                        loading: false,
                        error: errorMessage,
                    });
                }
            },

            clearAppointments: () => {
                set({
                    appointments: [],
                });
            },

            setError: (error: string | null) => {
                set({ error });
            },

            setCurrentView: (view: CalendarView) => {
                set({ currentView: view });
            },

            setCurrentDate: (date: Date) => {
                set({ currentDate: date });
            },
        }),
        {
            name: 'doctor-appointments-store',
        }
    )
);

export const useDoctorAppointments = () => {
    const {
        appointments,
        loading,
        error,
        currentView,
        currentDate,
        fetchAppointments,
        clearAppointments,
        setCurrentView,
        setCurrentDate,
    } = useDoctorAppointmentsStore();

    // Función para cambiar vista y cargar datos
    const changeView = (view: CalendarView) => {
        setCurrentView(view);
        fetchAppointments(view, currentDate);
    };

    // Función para cambiar fecha y cargar datos
    const changeDate = (date: Date) => {
        setCurrentDate(date);
        fetchAppointments(currentView, date);
    };

    // Función para refrescar datos actuales
    const refetch = () => {
        fetchAppointments(currentView, currentDate);
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchAppointments(currentView, currentDate);
        
        return () => {
            clearAppointments();
        };
    }, []);

    return {
        appointments,
        loading,
        error,
        currentView,
        currentDate,
        changeView,
        changeDate,
        refetch,
    };
};
