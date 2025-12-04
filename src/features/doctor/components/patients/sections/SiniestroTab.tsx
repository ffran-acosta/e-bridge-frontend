"use client";

import {
    Building,
    Calendar,
    Shield,
    Users,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared";
import { PatientProfile } from "@/shared/types/patients.types";
import { formatDateTime } from "../../../utils/dateFormatters";
import { formatContingencyType } from "../../../utils/patientFormatters";
import { useSiniestro } from "../../../hooks/useSiniestro";

// Función para formatear el motivo de cierre
const formatDischargeReason = (reason: string): string => {
    const reasons = {
        'ALTA_MEDICA': 'Alta Médica',
        'RECHAZO': 'Rechazo',
        'MUERTE': 'Muerte',
        'FIN_TRATAMIENTO': 'Fin de Tratamiento',
        'POR_DERIVACION': 'Por Derivación'
    };
    return reasons[reason as keyof typeof reasons] || reason;
};

interface SiniestroTabProps {
    patient: PatientProfile;
}

export function SiniestroTab({ patient }: SiniestroTabProps) {
    const { siniestro, loading, error } = useSiniestro(patient.siniestro?.id);

    if (!patient.siniestro) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground py-12">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Este paciente no tiene siniestro asociado</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground py-12">
                        <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                        <p>Cargando información del siniestro...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-red-500 py-12">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                        <p>Error al cargar información del siniestro</p>
                        <p className="text-sm text-muted-foreground mt-2">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!siniestro) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground py-12">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No se pudo cargar la información del siniestro</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información del Siniestro */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                        Información del Siniestro
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Tipo de Contingencia</h4>
                        <Badge variant="destructive" className="text-sm">
                            {formatContingencyType(siniestro.contingencyType)}
                        </Badge>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Fecha y Hora del Accidente</h4>
                        <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDateTime(siniestro.accidentDateTime)}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Estado del Siniestro</h4>
                        <div className="space-y-2">
                            <Badge 
                                variant={siniestro.status === 'ABIERTO' ? 'default' : 'secondary'} 
                                className="text-sm"
                            >
                                {siniestro.status === 'ABIERTO' ? 'Siniestro Abierto' : 'Siniestro Cerrado'}
                            </Badge>
                            {siniestro.status === 'CERRADO' && siniestro.dischargeReason && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Motivo de cierre: {formatDischargeReason(siniestro.dischargeReason)}
                                    </p>
                                    {siniestro.closedAt && (
                                        <p className="text-sm text-muted-foreground">
                                            Cerrado el: {formatDateTime(siniestro.closedAt)}
                                        </p>
                                    )}
                                    {siniestro.closedByDoctor && (
                                        <p className="text-sm text-muted-foreground">
                                            Por: Dr. {siniestro.closedByDoctor.user.firstName} {siniestro.closedByDoctor.user.lastName}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ART (Aseguradora) */}
            {siniestro.art && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-blue-500" />
                            ART - Aseguradora
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <h4 className="font-medium">{siniestro.art.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                Código: {siniestro.art.code}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empleador */}
            {siniestro.employer && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Building className="h-5 w-5 mr-2 text-green-500" />
                            Empleador
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <h4 className="font-medium">{siniestro.employer.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                CUIT: {siniestro.employer.cuit}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Establecimiento Médico */}
            {siniestro.medicalEstablishment && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-purple-500" />
                            Establecimiento Médico
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <h4 className="font-medium">{siniestro.medicalEstablishment.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                CUIT: {siniestro.medicalEstablishment.cuit}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
