'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    User,
    FileText,
    AlertCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@/shared';
import { formatAppointmentTime, formatAppointmentDate } from '../../utils/dateFormatters';
import { getPreviousWeek, getNextWeek, getStartOfWeek, getWeekDates, isToday } from '../../utils/dateUtils';
import type { BackendCalendarApiResponse } from '@/shared/types/patients.types';

interface WeeklyAppointmentsViewProps {
    appointments: BackendCalendarApiResponse['data']['data']['appointments'];
    currentDate: Date;
    loading: boolean;
    error: string | null;
    onDateChange: (date: Date) => void;
    onNavigateToPatient: (patientId: string) => void;
    onRefresh: () => void;
}

interface DayAppointments {
    date: Date;
    appointments: BackendCalendarApiResponse['data']['data']['appointments'];
}

export const WeeklyAppointmentsView = React.memo(({
    appointments,
    currentDate,
    loading,
    error,
    onDateChange,
    onNavigateToPatient,
    onRefresh
}: WeeklyAppointmentsViewProps) => {
    const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

    const navigateDate = useCallback((direction: 'prev' | 'next') => {
        const newDate = direction === 'next' ? getNextWeek(currentDate) : getPreviousWeek(currentDate);
        onDateChange(newDate);
    }, [currentDate, onDateChange]);

    // Organizar turnos por día de la semana
    const weekData = useMemo(() => {
        const weekDates = getWeekDates(currentDate);
        const startOfWeek = getStartOfWeek(currentDate);
        
        const dayAppointments: DayAppointments[] = weekDates.map(date => {
            // Convertir fecha a formato YYYY-MM-DD para comparar con el backend
            const dateStr = date.toISOString().split('T')[0];
            const dayAppointments = appointments.filter(appointment => appointment.date === dateStr);
            
            console.log('🔍 Filtering appointments for date:', {
                dateStr,
                totalAppointments: appointments.length,
                filteredCount: dayAppointments.length,
                sampleAppointments: appointments.slice(0, 3).map(a => ({
                    id: a.id,
                    date: a.date,
                    patient: a.patient
                }))
            });
            
            return { date, appointments: dayAppointments };
        });

        return {
            startOfWeek,
            weekDates,
            dayAppointments,
        };
    }, [appointments, currentDate]);

    // Calcular estadísticas de la semana
    const weekStats = useMemo(() => {
        const total = appointments.length;
        const completed = appointments.filter(a => a.status === 'COMPLETED').length;
        const scheduled = appointments.filter(a => a.status === 'SCHEDULED').length;
        const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;
        const noShow = appointments.filter(a => a.status === 'NO_SHOW').length;
        const artCount = appointments.filter(a => a.type === 'ART').length;
        const normalCount = appointments.filter(a => a.type === 'NORMAL').length;

        return {
            total,
            completed,
            scheduled,
            cancelled,
            noShow,
            artCount,
            normalCount,
        };
    }, [appointments]);

    const toggleDayExpansion = useCallback((dateStr: string) => {
        setExpandedDays(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dateStr)) {
                newSet.delete(dateStr);
            } else {
                newSet.add(dateStr);
            }
            return newSet;
        });
    }, []);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'step-1';        // PASO 1 - Azul (Programada)
            case 'COMPLETED':
                return 'step-4';        // PASO 4 - Verde (Completada)
            case 'CANCELLED':
                return 'cancelled';     // ESPECIAL - Rojo (Cancelada)
            case 'NO_SHOW':
                return 'no-show';       // ESPECIAL - Gris (No asistió)
            default:
                return 'step-1';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'Completado';
            case 'CANCELLED':
                return 'Cancelado';
            case 'NO_SHOW':
                return 'No asistió';
            default:
                return 'Programado';
        }
    };

    const getTypeBadgeVariant = (type: string) => {
        return type === 'ART' ? 'secondary' : 'outline';
    };

    const getShortDayName = (date: Date) => {
        return date.toLocaleDateString('es-ES', { weekday: 'short' });
    };

    const getDayName = (date: Date) => {
        return date.toLocaleDateString('es-ES', { weekday: 'long' });
    };

    if (error) {
        return (
            <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="text-red-600 mb-4">Error al cargar los turnos: {error}</p>
                <Button variant="outline" onClick={onRefresh}>
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con navegación de fechas */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateDate('prev')}
                        disabled={loading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">
                            Semana del {weekData.startOfWeek.getDate()}/{weekData.startOfWeek.getMonth() + 1} al {weekData.weekDates[6].getDate()}/{weekData.weekDates[6].getMonth() + 1}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Vista semanal
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateDate('next')}
                        disabled={loading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDateChange(new Date())}
                        disabled={loading}
                    >
                        Esta semana
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Resumen de la semana */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-medium mb-2">
                            Resumen de la semana
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{weekStats.total}</div>
                                <div className="text-muted-foreground">Total turnos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{weekStats.completed}</div>
                                <div className="text-muted-foreground">Completados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{weekStats.scheduled}</div>
                                <div className="text-muted-foreground">Pendientes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{weekStats.cancelled + weekStats.noShow}</div>
                                <div className="text-muted-foreground">Cancelados</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vista de días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-6">
                {weekData.dayAppointments.map(({ date, appointments: dayAppointments }) => {
                    const isTodayDate = isToday(date);
                    const dateStr = date.toISOString().split('T')[0]; // Usar formato YYYY-MM-DD
                    
                    return (
                        <div key={dateStr} className={`text-center p-3 rounded-lg border ${
                            isTodayDate ? 'bg-primary text-primary-foreground' : 'bg-muted/30'
                        }`}>
                            <div className="text-xs font-medium mb-1">
                                {getShortDayName(date)}
                            </div>
                            <div className="text-sm font-bold mb-1">
                                {date.getDate()}
                            </div>
                            <div className="text-xs">
                                {dayAppointments.length > 0 ? (
                                    <Badge variant={isTodayDate ? "secondary" : "default"} className="text-xs">
                                        {dayAppointments.length}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground">Sin turnos</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detalle día a día */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Cargando turnos...</p>
                </div>
            ) : weekStats.total === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No hay turnos programados</h3>
                            <p className="text-sm">
                                No se encontraron turnos para esta semana.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Detalle por día</h3>
            {weekData.dayAppointments.map(({ date, appointments: dayAppointments }) => {
                if (dayAppointments.length === 0) return null;

                const dateStr = date.toISOString().split('T')[0]; // Usar formato YYYY-MM-DD
                const isExpanded = expandedDays.has(dateStr);
                const hasMoreAppointments = dayAppointments.length > 3;
                const isTodayDate = isToday(date);

                        return (
                            <Card key={dateStr} className={`${
                                isTodayDate ? 'bg-primary/5 border-primary/20' : ''
                            }`}>
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`text-base font-medium ${isTodayDate ? 'text-primary' : ''}`}>
                                                {getDayName(date).charAt(0).toUpperCase() + getDayName(date).slice(1)}, {date.getDate()}/{date.getMonth() + 1}
                                            </div>
                                            {isTodayDate && (
                                                <Badge variant="default" className="text-xs">Hoy</Badge>
                                            )}
                                            <Badge variant="outline" className="text-xs">
                                                {dayAppointments.length} turno{dayAppointments.length !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                        {hasMoreAppointments && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleDayExpansion(dateStr)}
                                                className="h-6 px-2 text-xs"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        <ChevronUp className="h-3 w-3 mr-1" />
                                                        Ver menos
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="h-3 w-3 mr-1" />
                                                        Ver {dayAppointments.length - 3} más
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {(isExpanded ? dayAppointments : dayAppointments.slice(0, 3))
                                            .sort((a, b) => a.time.localeCompare(b.time))
                                            .map((appointment) => (
                                            <div key={appointment.id} className="flex items-center gap-3 p-2 rounded-md bg-background/50">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">{appointment.time}</span>
                                                        <Badge variant={getStatusBadgeVariant(appointment.status)} className="text-xs">
                                                            {getStatusText(appointment.status)}
                                                        </Badge>
                                                        {appointment.type === 'ART' && (
                                                            <Badge variant={getTypeBadgeVariant(appointment.type)} className="text-xs">
                                                                {appointment.type}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => onNavigateToPatient(appointment.patientId)}
                                                        className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors text-left truncate block"
                                                        title="Ver perfil del paciente"
                                                    >
                                                        {appointment.patient}
                                                    </button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onNavigateToPatient(appointment.patientId)}
                                                    className="h-6 px-2 text-xs"
                                                >
                                                    Ver
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
});
