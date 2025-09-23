'use client';

import React, { useMemo, useCallback } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Users,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@/shared';
import { getPreviousMonth, getNextMonth, getMonthDates, isToday } from '../../utils/dateUtils';
import type { BackendCalendarApiResponse } from '@/shared/types/patients.types';

interface MonthlyAppointmentsViewProps {
    appointments: BackendCalendarApiResponse['data']['data']['appointments'];
    currentDate: Date;
    loading: boolean;
    error: string | null;
    onDateChange: (date: Date) => void;
    onNavigateToDailyView: (date: Date) => void;
    onRefresh: () => void;
}

interface DayAppointments {
    date: Date;
    appointments: BackendCalendarApiResponse['data']['data']['appointments'];
}

export const MonthlyAppointmentsView = React.memo(({
    appointments,
    currentDate,
    loading,
    error,
    onDateChange,
    onNavigateToDailyView,
    onRefresh
}: MonthlyAppointmentsViewProps) => {
    const navigateDate = useCallback((direction: 'prev' | 'next') => {
        const newDate = direction === 'next' ? getNextMonth(currentDate) : getPreviousMonth(currentDate);
        onDateChange(newDate);
    }, [currentDate, onDateChange]);

    // Organizar turnos por día del mes
    const monthData = useMemo(() => {
        const monthDates = getMonthDates(currentDate);
        
        const dayAppointments: DayAppointments[] = monthDates.map(date => {
            // Convertir fecha a formato YYYY-MM-DD para comparar con el backend
            const dateStr = date.toISOString().split('T')[0];
            const dayAppointments = appointments.filter(appointment => appointment.date === dateStr);
            
            return { date, appointments: dayAppointments };
        });

        return {
            monthDates,
            dayAppointments,
        };
    }, [appointments, currentDate]);

    // Calcular estadísticas del mes
    const monthStats = useMemo(() => {
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

    // Función para obtener el color del badge según la cantidad de turnos
    const getBadgeVariant = (count: number) => {
        if (count === 0) return 'outline';
        return 'default'; // Todos los badges con turnos tienen el mismo color
    };

    // Función para obtener el nombre del mes
    const getMonthName = (date: Date) => {
        const monthYear = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    };

    // Función para obtener el nombre corto del día
    const getShortDayName = (date: Date) => {
        return date.toLocaleDateString('es-ES', { weekday: 'short' });
    };

    // Nombres de los días de la semana (orden correcto para calendario que empieza en lunes)
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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
                            {getMonthName(currentDate)}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Vista mensual
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
                        Este mes
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

            {/* Resumen del mes */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-medium mb-2">
                            Resumen del mes
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{monthStats.total}</div>
                                <div className="text-muted-foreground">Total turnos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{monthStats.completed}</div>
                                <div className="text-muted-foreground">Completados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{monthStats.scheduled}</div>
                                <div className="text-muted-foreground">Pendientes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{monthStats.cancelled + monthStats.noShow}</div>
                                <div className="text-muted-foreground">Cancelados</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Calendario mensual */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Cargando turnos...</p>
                </div>
            ) : monthStats.total === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No hay turnos programados</h3>
                            <p className="text-sm">
                                No se encontraron turnos para este mes.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        {/* Header del calendario con días de la semana */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid del calendario */}
                        <div className="grid grid-cols-7 gap-1">
                            {monthData.dayAppointments.map(({ date, appointments: dayAppointments }) => {
                                const isTodayDate = isToday(date);
                                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                const appointmentCount = dayAppointments.length;

                                return (
                                    <button
                                        key={date.toISOString()}
                                        onClick={() => onNavigateToDailyView(date)}
                                        disabled={!isCurrentMonth}
                                        className={`
                                            relative p-2 text-sm rounded-lg border transition-all duration-200
                                            ${isCurrentMonth 
                                                ? 'text-foreground hover:bg-primary/10 hover:border-primary/30 cursor-pointer' 
                                                : 'text-muted-foreground cursor-not-allowed'
                                            }
                                            ${isTodayDate 
                                                ? 'bg-primary text-primary-foreground border-primary' 
                                                : isCurrentMonth 
                                                    ? 'bg-background border-border' 
                                                    : 'bg-muted/30 border-muted'
                                            }
                                            ${appointmentCount > 0 && isCurrentMonth 
                                                ? 'hover:shadow-md' 
                                                : ''
                                            }
                                        `}
                                        title={
                                            isCurrentMonth 
                                                ? appointmentCount > 0 
                                                    ? `${appointmentCount} turno${appointmentCount !== 1 ? 's' : ''} - Click para ver detalles`
                                                    : 'Sin turnos'
                                                : ''
                                        }
                                    >
                                        <div className="text-center">
                                            <div className="mb-1">{date.getDate()}</div>
                                            {appointmentCount > 0 && isCurrentMonth && (
                                                <div className="mt-1">
                                                    <Badge 
                                                        variant={getBadgeVariant(appointmentCount)} 
                                                        className="text-xs"
                                                    >
                                                        {appointmentCount}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                    </CardContent>
                </Card>
            )}
        </div>
    );
});
