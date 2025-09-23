"use client";

import React from "react";
import {
    Activity,
    Phone,
} from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared";
import { PatientProfile } from "@/shared/types/patients.types";
import { mapEmergencyContact } from "../../../utils/patientFormatters";

interface OverviewTabProps {
    patient: PatientProfile;
}

export function OverviewTab({ patient }: OverviewTabProps) {
    const emergencyContact = mapEmergencyContact(patient);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información Médica */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Información Médica
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Historial Médico */}
                    <div>
                        <h4 className="font-medium mb-2">Historial Médico</h4>
                        {patient.medicalHistory.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {patient.medicalHistory.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Sin historial médico registrado
                            </p>
                        )}
                    </div>

                    {/* Medicamentos Actuales */}
                    <div>
                        <h4 className="font-medium mb-2">Medicamentos Actuales</h4>
                        {patient.currentMedications.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {patient.currentMedications.map((med, index) => (
                                    <li key={index}>{med}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Sin medicamentos registrados
                            </p>
                        )}
                    </div>

                    {/* Alergias */}
                    <div>
                        <h4 className="font-medium mb-2">Alergias</h4>
                        {patient.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {patient.allergies.map((allergy, index) => (
                                    <Badge key={index} variant="destructive">
                                        {allergy}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Sin alergias registradas
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Información de Cobertura e Información Adicional */}
            <div className="space-y-6">
                {/* Contacto de Emergencia */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contacto de Emergencia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="font-medium">{emergencyContact.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {emergencyContact.relationship}
                            </p>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{emergencyContact.phone}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Información de la Cobertura */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cobertura Médica</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">{patient.insurance.name}</p>
                                <Badge variant={patient.insurance.isActive ? "default" : "secondary"}>
                                    {patient.insurance.isActive ? "Activo" : "Inactivo"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Plan: {patient.insurance.planName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Código: {patient.insurance.code}
                            </p>
                            {patient.insurance.contactInfo && (
                                <p className="text-sm text-muted-foreground">
                                    Contacto: {patient.insurance.contactInfo}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Estadísticas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estadísticas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Total Consultas</p>
                                <p className="font-medium">{patient.stats.totalConsultations}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total Turnos</p>
                                <p className="font-medium">{patient.stats.totalAppointments}</p>
                            </div>
                            {patient.stats.nextAppointmentDate && (
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">Próximo Turno</p>
                                    <p className="font-medium">
                                        {new Date(patient.stats.nextAppointmentDate).toLocaleDateString('es-AR')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}