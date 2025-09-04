"use client";

import React from "react";
import {
    Building,
    Calendar,
    Shield,
    Users,
    AlertTriangle,
    Clock
} from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared";
import { PatientProfile } from "@/shared/types/patients.types";
import { formatDateTime, formatContingencyType } from "../../../utils/patientMappers";

interface SiniestroTabProps {
    patient: PatientProfile;
}

export function SiniestroTab({ patient }: SiniestroTabProps) {
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

    const { siniestro } = patient;

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
                        <h4 className="font-medium mb-2">Registro del Siniestro</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Creado: {formatDateTime(siniestro.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>Actualizado: {formatDateTime(siniestro.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ART (Aseguradora) */}
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

            {/* Empleador */}
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

            {/* Establecimiento Médico */}
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
        </div>
    );
}
