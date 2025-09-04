import { AlertCircle, Calendar, FileText, MapPin, Plus, RefreshCw, Stethoscope, User } from 'lucide-react';
import {
    Alert,
    AlertDescription,
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Skeleton
} from '@/shared';
import type { PatientProfile } from '@/shared/types/patients.types';
import { usePatientConsultations } from '@/features/doctor/hooks/usePatientConsultations';
import { formatConsultationDate, formatDoctorInfo, formatNextAppointmentDate, getArtCaseLabel, getConsultationStatus, truncateText } from '@/features/doctor/utils/patientMappers';

interface ConsultationsTabProps {
    patient: PatientProfile;
}

export const ConsultationsTab = ({ patient }: ConsultationsTabProps) => {
    const {
        consultations,
        pagination,
        loading,
        error,
        refetch,
        loadPage
    } = usePatientConsultations(patient.id);

    if (loading && consultations.length === 0) {
        return <ConsultationsLoading />;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                    <span>Error al cargar las consultas: {error}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refetch}
                        className="ml-4"
                    >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reintentar
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (consultations.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                        <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No hay consultas registradas</p>
                        <p className="text-sm">Este paciente aún no tiene consultas médicas.</p>
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
                                <Stethoscope className="h-5 w-5" />
                                Historial de Consultas
                            </div>
                            <Badge variant="secondary" className="w-fit">
                                {pagination?.total || consultations.length} total
                            </Badge>
                        </div>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Consulta
                        </Button>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Lista de consultas */}
            <div className="grid gap-4">
                {consultations.map((consultation) => {
                    const status = getConsultationStatus(consultation);
                    const artCase = getArtCaseLabel(consultation.isArtCase);

                    return (
                        <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">
                                            {consultation.consultationReason}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {formatConsultationDate(consultation.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge variant={status.variant}>
                                            {status.label}
                                        </Badge>
                                        <Badge variant={artCase.variant}>
                                            {artCase.label}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Diagnóstico */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4" />
                                        Diagnóstico
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {truncateText(consultation.diagnosis, 150)}
                                    </p>
                                </div>

                                {/* Doctor */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <User className="h-4 w-4" />
                                        Médico tratante
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {formatDoctorInfo(consultation)}
                                    </p>
                                </div>

                                {/* Establecimiento médico */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <MapPin className="h-4 w-4" />
                                        Establecimiento
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">
                                        {consultation.medicalEstablishment.name}
                                    </p>
                                </div>

                                {/* Próxima cita */}
                                {consultation.nextAppointmentDate && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Calendar className="h-4 w-4" />
                                            Próxima cita
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-6">
                                            {formatNextAppointmentDate(consultation.nextAppointmentDate)}
                                        </p>
                                    </div>
                                )}

                                {/* Empleador (si es caso ART) */}
                                {consultation.employer && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <User className="h-4 w-4" />
                                            Empleador
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-6">
                                            {consultation.employer.name}
                                        </p>
                                    </div>
                                )}
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
                                ({pagination.total} consultas total)
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
            {loading && consultations.length > 0 && (
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
const ConsultationsLoading = () => {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
            </Card>

            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                    <CardHeader>
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-64" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};