'use client';

import React from 'react';
import {
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    User,
    FileText,
    AlertCircle
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@/shared';
import { formatAppointmentTime, formatAppointmentDate } from '../../utils/dateFormatters';
import { getPreviousDay, getNextDay, isToday } from '../../utils/dateUtils';
import type { BackendCalendarAppointment } from '@/shared/types/patients.types';

interface DailyAppointmentsViewProps {
    appointments: BackendCalendarAppointment[];
    currentDate: Date;
    loading: boolean;
    error: string | null;
    onDateChange: (date: Date) => void;
    onNavigateToPatient: (patientId: string) => void;
    onRefresh: () => void;
}

export const DailyAppointmentsView = ({
    appointments,
    currentDate,
    loading,
    error,
    onDateChange,
    onNavigateToPatient,
    onRefresh
}: DailyAppointmentsViewProps) => {
    const isTodayDate = isToday(currentDate);

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = direction === 'next' ? getNextDay(currentDate) : getPreviousDay(currentDate);
        onDateChange(newDate);
    };

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
                            {currentDate.toLocaleDateString('es-ES', { weekday: 'long' }).charAt(0).toUpperCase() + currentDate.toLocaleDateString('es-ES', { weekday: 'long' }).slice(1)}, {formatAppointmentDate(currentDate.toISOString())}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {isTodayDate ? 'Hoy' : 'Vista diaria'}
                            </span>
                            {isTodayDate && (
                                <Badge variant="default" className="text-xs">Hoy</Badge>
                            )}
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
                        Ir a Hoy
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

            {/* Resumen del día */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-medium mb-2">
                            Resumen del día
                        </h3>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span>
                                <strong className="text-foreground">{appointments.length}</strong> turno{appointments.length !== 1 ? 's' : ''} programado{appointments.length !== 1 ? 's' : ''}
                            </span>
                            <span>•</span>
                            <span>
                                <strong className="text-foreground">
                                    {appointments.filter(a => a.status === 'COMPLETED').length}
                                </strong> completado{appointments.filter(a => a.status === 'COMPLETED').length !== 1 ? 's' : ''}
                            </span>
                            <span>•</span>
                            <span>
                                <strong className="text-foreground">
                                    {appointments.filter(a => a.status === 'SCHEDULED').length}
                                </strong> pendiente{appointments.filter(a => a.status === 'SCHEDULED').length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de turnos */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Cargando turnos...</p>
                </div>
            ) : appointments.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No hay turnos programados</h3>
                            <p className="text-sm">
                                No se encontraron turnos para el {formatAppointmentDate(currentDate.toISOString())}.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    <h3 className="text-lg font-medium">Turnos del día</h3>
                    {appointments
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((appointment) => (
                            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-4">
                                    <div className="flex items-start gap-4">
                                        {/* Icono de reloj */}
                                        <div className="flex-shrink-0 mt-1">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>

                                        {/* Información principal */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg font-semibold">
                                                    {appointment.time}
                                                </span>
                                                <Badge variant={getStatusBadgeVariant(appointment.status)}>
                                                    {getStatusText(appointment.status)}
                                                </Badge>
                                                {appointment.type === 'ART' && (
                                                    <Badge variant={getTypeBadgeVariant(appointment.type)}>
                                                        {appointment.type}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Información del paciente */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <button
                                                        onClick={() => onNavigateToPatient(appointment.patientId)}
                                                        className="text-base font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                                                    >
                                                        {appointment.patient}
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">
                                                        DNI: {appointment.dni}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onNavigateToPatient(appointment.patientId)}
                                            >
                                                Ver perfil
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            )}
        </div>
    );
};
