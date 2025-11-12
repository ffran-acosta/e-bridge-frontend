"use client";

import {
    Edit,
    Phone,
    Mail,
    MapPin,
    User,
    Plus,
} from "lucide-react";
import { Badge, Button, Card, CardHeader, CardTitle } from "@/shared";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { PatientProfile } from "@/shared/types/patients.types";
import { getFullName, calculateAge, formatPhone, formatAddress, isARTPatient } from "../../../utils/patientFormatters";
import { formatLastConsultation } from "../../../utils/dateFormatters";

interface PatientHeaderProps {
    patient: PatientProfile;
    onEdit?: () => void;
    onContinueSiniestro?: () => void;
}

export function PatientHeader({ patient, onEdit, onContinueSiniestro }: PatientHeaderProps) {
    return (
        <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-end space-x-2">
                {isARTPatient(patient) && (
                    <Button variant="default" onClick={onContinueSiniestro}>
                        <Plus className="h-4 w-4 mr-2" />
                        Continuar Siniestro
                    </Button>
                )}
                <Button variant="outline" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                </Button>
            </div>

            {/* Patient Header Card */}
            <Card>
                <CardHeader>
                    <div className="space-y-6">
                        {/* Patient Info */}
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-xl md:text-2xl">
                                    {getFullName(patient)}
                                </CardTitle>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    DNI: {patient.dni} • {calculateAge(patient.birthdate)} años
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <StatusBadge status={patient.currentStatus} />
                                    {isARTPatient(patient) && (
                                        <Badge variant="destructive">
                                            ART
                                        </Badge>
                                    )}
                                    <span className="text-xs md:text-sm text-muted-foreground">
                                        Última consulta: {formatLastConsultation(patient.stats.lastConsultationDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="break-all">{formatPhone(patient)}</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <span className="break-words">{formatAddress(patient)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="break-all">{patient.email}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}