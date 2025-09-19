// features/doctor/components/calendar/AppointmentsCalendar.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
    Calendar, 
    Clock, 
    ChevronLeft, 
    ChevronRight, 
    Users,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared';
import { useDoctorAppointments } from '../../hooks/useDoctorAppointments';
import { formatAppointmentTime, formatAppointmentDate } from '../../utils/dateFormatters';
import { 
    getPreviousDay, 
    getNextDay, 
    getPreviousWeek, 
    getNextWeek, 
    getPreviousMonth, 
    getNextMonth,
    getStartOfWeek,
    getWeekDates,
    getMonthDates,
    getShortDayName,
    getDayName,
    getMonthName,
    isToday,
    formatDateForAPI
} from '../../utils/dateUtils';
import type { Appointment } from '@/shared/types/patients.types';

type CalendarView = 'daily' | 'weekly' | 'monthly';

interface AppointmentsCalendarProps {
    className?: string;
}

export const AppointmentsCalendar = ({ className }: AppointmentsCalendarProps) => {
    const { 
        appointments, 
        loading, 
        error, 
        currentView, 
        currentDate, 
        changeView, 
        changeDate, 
        refetch 
    } = useDoctorAppointments();

    // Estado para manejar qué días están expandidos en la vista semanal
    const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

    // Función para alternar la expansión de un día
    const toggleDayExpansion = (dayStr: string) => {
        const newExpandedDays = new Set(expandedDays);
        if (newExpandedDays.has(dayStr)) {
            newExpandedDays.delete(dayStr);
        } else {
            newExpandedDays.add(dayStr);
        }
        setExpandedDays(newExpandedDays);
    };

    // Función para navegar al perfil del paciente
    const goToPatientProfile = (patientId: string) => {
        if (patientId && patientId.trim() !== '') {
            const url = `/doctor/patients/${patientId}`;
            window.location.href = url;
        }
    };

    // Función para obtener el nombre del paciente
    const getPatientName = (appointment: Appointment): string => {
        return appointment.patient.fullName || `Paciente ${appointment.patient.dni}`;
    };

    // Filtrar turnos por fecha
    const getAppointmentsForDate = (date: Date): Appointment[] => {
        const dateStr = date.toISOString().split('T')[0];
        return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.scheduledDateTime).toISOString().split('T')[0];
            return appointmentDate === dateStr;
        }).sort((a, b) => 
            new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime()
        );
    };

    // Obtener turnos para la semana - agrupa todos los turnos del endpoint por día
    const getAppointmentsForWeek = (date: Date): { [key: string]: Appointment[] } => {
        const startOfWeek = getStartOfWeek(date);
        const weekAppointments: { [key: string]: Appointment[] } = {};
        
        // Inicializar todos los días de la semana
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const dayStr = day.toISOString().split('T')[0];
            weekAppointments[dayStr] = [];
        }
        
        // Agrupar todos los turnos del endpoint por día
        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.scheduledDateTime).toISOString().split('T')[0];
            if (weekAppointments[appointmentDate]) {
                weekAppointments[appointmentDate].push(appointment);
            }
        });
        
        // Ordenar turnos por hora dentro de cada día
        Object.keys(weekAppointments).forEach(dayStr => {
            weekAppointments[dayStr].sort((a, b) => 
                new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime()
            );
        });
        
        return weekAppointments;
    };

    // Obtener turnos para el mes - cuenta turnos por día
    const getAppointmentsForMonth = (date: Date): { [key: string]: number } => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const monthAppointments: { [key: string]: number } = {};
        
        // Inicializar todos los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const dayStr = dayDate.toISOString().split('T')[0];
            monthAppointments[dayStr] = 0;
        }
        
        // Contar turnos por día
        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.scheduledDateTime).toISOString().split('T')[0];
            if (monthAppointments[appointmentDate] !== undefined) {
                monthAppointments[appointmentDate]++;
            }
        });
        
        return monthAppointments;
    };

    // Navegación de fechas
    const navigateDate = (direction: 'prev' | 'next') => {
        let newDate: Date;
        
        switch (currentView) {
            case 'daily':
                newDate = direction === 'next' ? getNextDay(currentDate) : getPreviousDay(currentDate);
                break;
            case 'weekly':
                newDate = direction === 'next' ? getNextWeek(currentDate) : getPreviousWeek(currentDate);
                break;
            case 'monthly':
                newDate = direction === 'next' ? getNextMonth(currentDate) : getPreviousMonth(currentDate);
                break;
            default:
                newDate = currentDate;
        }
        
        changeDate(newDate);
    };


    // Renderizar vista diaria
    const renderDailyView = () => {
        const dayAppointments = getAppointmentsForDate(currentDate);
        
        return (
            <div className="space-y-3">
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {getDayName(currentDate)}, {formatAppointmentDate(currentDate.toISOString())}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {dayAppointments.length} turnos programados
                    </p>
                </div>
                
                {dayAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No hay turnos para este día</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {dayAppointments.map((appointment) => (
                            <div key={appointment.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                <Clock className="h-4 w-4 text-primary" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {formatAppointmentTime(appointment.scheduledDateTime)}
                                    </p>
                                            <button
                                                onClick={() => goToPatientProfile(appointment.patient.id)}
                                                className="text-xs text-muted-foreground truncate hover:text-primary hover:underline transition-colors text-left"
                                                title="Ver perfil del paciente"
                                            >
                                                {getPatientName(appointment)}
                                            </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Badge 
                                        variant={appointment.status === 'COMPLETED' ? 'secondary' : 'default'}
                                        className="text-xs"
                                    >
                                        {appointment.status === 'COMPLETED' ? 'Completado' : 
                                         appointment.status === 'CANCELLED' ? 'Cancelado' : 'Programado'}
                                    </Badge>
                                    {appointment.patient.dni && (
                                        <Badge variant="outline" className="text-xs">
                                            {appointment.patient.dni}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Renderizar vista semanal
    const renderWeeklyView = () => {
        const weekDates = getWeekDates(currentDate);
        const startOfWeek = getStartOfWeek(currentDate);
        
        return (
            <div className="space-y-3">
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Semana del {startOfWeek.getDate()}/{startOfWeek.getMonth() + 1}
                    </h3>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                    {weekDates.map((dayDate, index) => {
                        const dayAppointments = getAppointmentsForDate(dayDate);
                        
                        return (
                            <div key={index} className="text-center">
                                <div className="text-xs font-medium mb-1">
                                    {getShortDayName(dayDate)}
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">
                                    {dayDate.getDate()}
                                </div>
                                <div className="text-xs">
                                    {dayAppointments.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {dayAppointments.length}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="space-y-2">
                    {weekDates.map((dayDate) => {
                        const dayAppointments = getAppointmentsForDate(dayDate);
                        if (dayAppointments.length === 0) return null;
                        
                        const dayStr = dayDate.toISOString();
                        const isExpanded = expandedDays.has(dayStr);
                        const hasMoreAppointments = dayAppointments.length > 3;
                        
                        return (
                            <div key={dayStr} className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium">
                                        {getDayName(dayDate)}, {formatAppointmentDate(dayStr)}
                                    </div>
                                    {hasMoreAppointments && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleDayExpansion(dayStr)}
                                            className="h-6 px-2 text-xs"
                                        >
                                            {isExpanded ? 'Ver menos' : `+${dayAppointments.length - 3} más`}
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {(isExpanded ? dayAppointments : dayAppointments.slice(0, 3)).map((appointment) => (
                                        <div key={appointment.id} className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{formatAppointmentTime(appointment.scheduledDateTime)}</span>
                                                    <button
                                                        onClick={() => goToPatientProfile(appointment.patient.id)}
                                                        className="truncate hover:text-primary hover:underline transition-colors text-left"
                                                        title="Ver perfil del paciente"
                                                    >
                                                        {getPatientName(appointment)}
                                                    </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Renderizar vista mensual
    const renderMonthlyView = () => {
        const monthDates = getMonthDates(currentDate);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - firstDay.getDay());
        
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        return (
            <div className="space-y-3">
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                    </h3>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                            {day}
                        </div>
                    ))}
                    
                    {Array.from({ length: 42 }).map((_, index) => {
                        const date = new Date(startDate);
                        date.setDate(startDate.getDate() + index);
                        const appointmentCount = getAppointmentsForDate(date).length;
                        const isCurrentMonth = date.getMonth() === month;
                        const isTodayDate = isToday(date);
                        
                        return (
                            <div 
                                key={index} 
                                className={`text-center p-1 text-xs ${
                                    isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                                } ${isTodayDate ? 'bg-primary text-primary-foreground rounded' : ''}`}
                            >
                                <div>{date.getDate()}</div>
                                {appointmentCount > 0 && (
                                    <div className="mt-1">
                                        <Badge variant="secondary" className="text-xs">
                                            {appointmentCount}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="pt-6">
                    <div className="text-center text-red-600">
                        <p className="mb-2">Error al cargar los turnos</p>
                        <Button variant="outline" size="sm" onClick={refetch}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Calendario de Turnos
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                
                {/* Controles de navegación */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        <Button
                            variant={currentView === 'daily' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => changeView('daily')}
                        >
                            Día
                        </Button>
                        <Button
                            variant={currentView === 'weekly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => changeView('weekly')}
                        >
                            Semana
                        </Button>
                        <Button
                            variant={currentView === 'monthly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => changeView('monthly')}
                        >
                            Mes
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                            <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => changeDate(new Date())}>
                            Hoy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Cargando turnos...</span>
                    </div>
                ) : (
                    <>
                        {currentView === 'daily' && renderDailyView()}
                        {currentView === 'weekly' && renderWeeklyView()}
                        {currentView === 'monthly' && renderMonthlyView()}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
