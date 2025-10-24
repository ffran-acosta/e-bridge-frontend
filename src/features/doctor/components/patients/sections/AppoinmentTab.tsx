    import { AlertCircle, Calendar, Clock, MapPin, RefreshCw, Stethoscope, FileText, Plus, Trash2, Settings } from 'lucide-react';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Skeleton
} from '@/shared';
import { formatAppointmentDateTime, formatAppointmentDate, formatAppointmentTime } from '../../../utils/dateFormatters';
import { getAppointmentStatus, isUpcomingAppointment, isOverdueAppointment, getAppointmentFollowUp, formatMedicalEstablishmentInfo } from '../../../utils/appointmentFormatters';
import { truncateText } from '../../../utils/patientFormatters';
import type { PatientProfile } from '@/shared/types/patients.types';
import { usePatientAppointments } from '@/features/doctor/hooks/usePatientAppoinment';
import { DeleteAppointmentModal, CancelAppointmentModal, CompleteAppointmentModal, CreateAppointmentButton } from '../../modals/appointments';
import { useAuthStore } from '@/features/auth/store/auth';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { appointmentStatuses, getAppointmentStatusLabel, getAppointmentStatusVariant } from '../../../constants/appointmentStatuses';

interface AppointmentsTabProps {
    patient: PatientProfile;
}

export const AppointmentsTab = ({ patient }: AppointmentsTabProps) => {
    const { user } = useAuthStore();
    const {
        appointments,
        pagination,
        loading,
        error,
        refetch,
        loadPage
    } = usePatientAppointments(patient.id);

    // Obtener el doctorId del usuario autenticado
    const doctorId = user?.doctor?.id || '';

    // Estado para los modales
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null);
    const [completeModalOpen, setCompleteModalOpen] = useState(false);
    const [appointmentToComplete, setAppointmentToComplete] = useState<any>(null);

    // Función para abrir el modal de eliminar
    const handleDeleteClick = (appointment: any) => {
        setAppointmentToDelete(appointment);
        setDeleteModalOpen(true);
    };

    // Función para cerrar el modal
    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setAppointmentToDelete(null);
    };

    // Función para manejar el éxito de la eliminación
    const handleDeleteSuccess = () => {
        refetch(); // Recargar la lista de turnos
    };

    // Funciones para cancelar turno
    const handleCancelClick = (appointment: any) => {
        setAppointmentToCancel(appointment);
        setCancelModalOpen(true);
    };

    const handleCancelModalClose = () => {
        setCancelModalOpen(false);
        setAppointmentToCancel(null);
    };

    const handleCancelSuccess = () => {
        refetch();
    };

    // Funciones para completar turno
    const handleCompleteClick = (appointment: any) => {
        setAppointmentToComplete(appointment);
        setCompleteModalOpen(true);
    };

    const handleCompleteModalClose = () => {
        setCompleteModalOpen(false);
        setAppointmentToComplete(null);
    };

    const handleCompleteSuccess = () => {
        refetch();
    };

    // Función para manejar cambios de estado
    const handleStatusChange = (appointment: any, newStatus: string) => {
        console.log('🎯 Cambiando estado del turno:', appointment.id, 'a:', newStatus);
        
        switch (newStatus) {
            case 'CANCELLED':
                handleCancelClick(appointment);
                break;
            case 'COMPLETED':
                handleCompleteClick(appointment);
                break;
            case 'RESCHEDULED':
                // TODO: Implementar modal de reagendamiento
                alert('Funcionalidad de reagendamiento próximamente');
                break;
            default:
                console.log('Estado no manejado:', newStatus);
        }
    };

    if (loading && appointments.length === 0) {
        return <AppointmentsLoading />;
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-destructive">
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
                        <p className="text-sm mb-4">Este paciente aún no tiene turnos asignados.</p>
                        
                        {/* Botón para crear primer turno */}
                        <div className="flex justify-center">
                        <CreateAppointmentButton
                            patientId={patient.id}
                            patientName={`${patient.firstName} ${patient.lastName}`}
                            doctorId={doctorId}
                            hasAppointments={false}
                            onAppointmentSuccess={() => {
                                console.log('✅ Primer turno creado exitosamente');
                                refetch(); // Recargar la lista de turnos
                            }}
                        />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header compacto cuando hay turnos */}
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3 border">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Turnos del Paciente</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {pagination?.total || appointments.length} turnos total
                    </Badge>
                </div>
                
                {/* Botón compacto para crear turno */}
                <div className="flex items-center gap-2">
                    <CreateAppointmentButton
                        patientId={patient.id}
                        patientName={`${patient.firstName} ${patient.lastName}`}
                        doctorId={doctorId}
                        hasAppointments={appointments.length > 0}
                        onAppointmentSuccess={() => {
                            console.log('✅ Turno creado exitosamente');
                            refetch(); // Recargar la lista de turnos
                        }}
                    />
                </div>
            </div>

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
                            className="hover:shadow-md transition-shadow"
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
                                                <Badge variant="default" className="bg-primary/20 text-primary">
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
                                        
                                        {/* Selector de estado */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">
                                                Cambiar Estado
                                            </label>
                                            <Select
                                                value={appointment.status || 'SCHEDULED'}
                                                onValueChange={(newStatus) => handleStatusChange(appointment, newStatus)}
                                                disabled={appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'}
                                            >
                                                <SelectTrigger className="w-full h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {appointmentStatuses.map((statusOption) => (
                                                        <SelectItem 
                                                            key={statusOption.value} 
                                                            value={statusOption.value}
                                                            disabled={statusOption.value === appointment.status}
                                                        >
                                                            {statusOption.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteClick(appointment)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Eliminar
                                        </Button>
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
                                            <span className={`w-2 h-2 rounded-full ${followUp.hasOrigin ? 'bg-status-step-4' : 'bg-muted'
                                                }`}></span>
                                            <span className="text-muted-foreground">
                                                {followUp.hasOrigin ? 'Tiene consulta origen' : 'Sin consulta origen'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`w-2 h-2 rounded-full ${followUp.hasCompletion ? 'bg-status-step-4' : 'bg-muted'
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

            {/* Modal de eliminar turno */}
            {appointmentToDelete && (
                <DeleteAppointmentModal
                    isOpen={deleteModalOpen}
                    onClose={handleDeleteModalClose}
                    appointment={appointmentToDelete}
                    patientName={`${patient.firstName} ${patient.lastName}`}
                    onSuccess={handleDeleteSuccess}
                />
            )}

            {/* Modal de cancelar turno */}
            {appointmentToCancel && (
                <CancelAppointmentModal
                    isOpen={cancelModalOpen}
                    onClose={handleCancelModalClose}
                    appointment={appointmentToCancel}
                    patientName={`${patient.firstName} ${patient.lastName}`}
                    onSuccess={handleCancelSuccess}
                />
            )}

            {/* Modal de completar turno */}
            {appointmentToComplete && (
                <CompleteAppointmentModal
                    isOpen={completeModalOpen}
                    onClose={handleCompleteModalClose}
                    appointment={appointmentToComplete}
                    patientName={`${patient.firstName} ${patient.lastName}`}
                    consultations={[]}
                    onSuccess={handleCompleteSuccess}
                />
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
                    <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
                </CardHeader>
            </Card>

            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                    <CardHeader>
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <div className="h-5 w-64 bg-muted animate-pulse rounded"></div>
                                <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
                                <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                            <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};