"use client";

import React from "react";
import {
    Edit,
    Download,
    Phone,
    Mail,
    MapPin,
    User,
} from "lucide-react";
import { Badge, Button, Card, CardHeader, CardTitle } from "@/shared";
import { PatientProfile } from "@/shared/types/patients.types";
import {
    getFullName, 
    calculateAge, 
    formatPhone, 
    formatAddress,
    getStatusBadgeVariant,
    formatStatus,
    isARTPatient
} from "../../../utils/patientFormatters";
import { formatLastConsultation } from "../../../utils/dateFormatters";

interface PatientHeaderProps {
    patient: PatientProfile;
    onEdit?: () => void;
    onExport?: () => void;
}

export function PatientHeader({ patient, onEdit, onExport }: PatientHeaderProps) {
    return (
        <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                </Button>
                <Button variant="outline" onClick={onExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                </Button>
            </div>

            {/* Patient Header Card */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">
                                    {getFullName(patient)}
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    DNI: {patient.dni} • {calculateAge(patient.birthdate)} años
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant={getStatusBadgeVariant(patient.currentStatus)}>
                                        {formatStatus(patient.currentStatus)}
                                    </Badge>
                                    {isARTPatient(patient) && (
                                        <Badge variant="destructive">
                                            ART
                                        </Badge>
                                    )}
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">
                                        Última consulta: {formatLastConsultation(patient.stats.lastConsultationDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{formatPhone(patient)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{formatAddress(patient)}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}