    import { AlertCircle, Calendar, Clock, MapPin, RefreshCw, Stethoscope, FileText, Plus } from 'lucide-react';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Skeleton
} from '@/shared';
import {
    formatAppointmentDateTime,
    formatAppointmentDate,
    formatAppointmentTime,
    getAppointmentStatus,
    isUpcomingAppointment,
    isOverdueAppointment,
    getAppointmentFollowUp,
    formatMedicalEstablishmentInfo,
    truncateText
} from '../../../utils/patientMappers';
import type { PatientProfile } from '@/shared/types/patients.types';
import { usePatientAppointments } from '@/features/doctor/hooks/usePatientAppoinment';

interface AppointmentsTabProps {
    patient: PatientProfile;
}

export const AppointmentsTab = ({ patient }: AppointmentsTabProps) => {
    const {
        appointments,
        pagination,
        loading,
        error,
        refetch,
        loadPage
    } = usePatientAppointments(patient.id);

    if (loading && appointments.length === 0) {
        return <AppointmentsLoading />;
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-red-600">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>Error al cargar los turnos: {error}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refetch}
                        >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (appointments.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No hay turnos programados</p>
                        <p className="text-sm">Este paciente aún no tiene turnos asignados.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header con información de resumen */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Turnos del Paciente
                            </div>
                            <Badge variant="secondary" className="w-fit">
                                {pagination?.total || appointments.length} total
                            </Badge>
                        </div>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Turno
                        </Button>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Lista de turnos */}
            <div className="grid gap-4">
                {appointments.map((appointment) => {
                    const status = getAppointmentStatus(appointment);
                    const followUp = getAppointmentFollowUp(appointment);
                    const isUpcoming = isUpcomingAppointment(appointment);
                    const isOverdue = isOverdueAppointment(appointment);

                    return (
                        <Card
                            key={appointment.id}
                            className={`hover:shadow-md transition-shadow ${isUpcoming ? 'ring-2 ring-blue-200 bg-blue-50/50' :
                                    isOverdue ? 'ring-2 ring-red-200 bg-red-50/50' : ''
                                }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg">
                                                {formatAppointmentDate(appointment.scheduledDateTime)}
                                            </CardTitle>
                                            {isUpcoming && (
                                                <Badge variant="default" className="bg-blue-100 text-blue-800">
                                                    Próximo
                                                </Badge>
                                            )}
                                            {isOverdue && (
                                                <Badge variant="destructive">
                                                    Vencido
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-lg font-medium">
                                            <Clock className="h-4 w-4" />
                                            {formatAppointmentTime(appointment.scheduledDateTime)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge variant={status.variant}>
                                            {status.label}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {followUp.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Notas del turno */}
                                {appointment.notes && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <FileText className="h-4 w-4" />
                                            Notas
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-6">
                                            {truncateText(appointment.notes, 150)}
                                        </p>
                                    </div>
                                )}

                                {/* Establecimiento médico */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <MapPin className="h-4 w-4" />
                                        Establecimiento
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {formatMedicalEstablishmentInfo(appointment)}
                                    </p>
                                </div>

                                {/* Información de seguimiento */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Stethoscope className="h-4 w-4" />
                                        Seguimiento médico
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`w-2 h-2 rounded-full ${followUp.hasOrigin ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></span>
                                            <span className="text-muted-foreground">
                                                {followUp.hasOrigin ? 'Tiene consulta origen' : 'Sin consulta origen'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`w-2 h-2 rounded-full ${followUp.hasCompletion ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></span>
                                            <span className="text-muted-foreground">
                                                {followUp.hasCompletion ? 'Consulta completada' : 'Sin consulta completada'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de registro */}
                                <div className="text-xs text-muted-foreground pt-2 border-t">
                                    Creado: {formatAppointmentDateTime(appointment.createdAt)}
                                    {appointment.updatedAt !== appointment.createdAt && (
                                        <span className="ml-4">
                                            Actualizado: {formatAppointmentDateTime(appointment.updatedAt)}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Paginación */}
            {pagination && pagination.totalPages > 1 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Página {pagination.page} de {pagination.totalPages}
                                ({pagination.total} turnos total)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadPage(pagination.page - 1)}
                                    disabled={pagination.page <= 1 || loading}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadPage(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages || loading}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading overlay para paginación */}
            {loading && appointments.length > 0 && (
                <div className="relative">
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Cargando...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente de loading
const AppointmentsLoading = () => {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                </CardHeader>
            </Card>

            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                    <CardHeader>
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <div className="h-5 w-64 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};