"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { AlertCircle, Calendar, FileText, MapPin, User, Building, Stethoscope, Clock, Phone, Mail, AlertTriangle } from 'lucide-react';
import { useConsultationDetails } from '../../../hooks/useConsultationDetails';
import { formatConsultationDate, formatNextAppointmentDate } from '../../../utils/dateFormatters';
import { cn } from '@/lib/utils';

interface ConsultationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string | null;
}

export function ConsultationDetailsModal({
  isOpen,
  onClose,
  consultationId,
}: ConsultationDetailsModalProps) {
  const { consultation, loading, error } = useConsultationDetails({
    consultationId,
    enabled: isOpen && !!consultationId,
  });

  if (!isOpen) return null;

  const getConsultationTypeVariant = (type: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants = {
      'INGRESO': 'default' as const,
      'ATENCION': 'secondary' as const,
      'ALTA': 'destructive' as const,
      'REINGRESO': 'outline' as const
    };
    return variants[type as keyof typeof variants] || 'default';
  };

  const getConsultationTypeColor = (type: string): string => {
    const colors = {
      'INGRESO': 'text-blue-600 bg-blue-50',
      'ATENCION': 'text-green-600 bg-green-50',
      'ALTA': 'text-red-600 bg-red-50',
      'REINGRESO': 'text-purple-600 bg-purple-50'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col sm:max-w-6xl">
        <DialogHeader className="flex-shrink-0 pb-6 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-500" />
            Detalles de Consulta
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            Información completa de la consulta médica
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
            {loading && (
              <div className="space-y-6">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-destructive text-sm">Error al cargar los detalles: {error}</p>
              </div>
            )}

            {consultation && !loading && (
              <div className="space-y-6">
                {/* Header de la consulta */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-blue-500" />
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Tipo de Consulta</label>
                        <Badge 
                          variant={getConsultationTypeVariant(consultation.type)}
                          className="text-sm"
                        >
                          {consultation.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatConsultationDate(consultation.createdAt)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Fecha de Asistencia</label>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatConsultationDate(consultation.medicalAssistanceDate)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Lugar de Asistencia</label>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {consultation.medicalAssistancePlace}
                        </div>
                      </div>
                      
                      {consultation.nextAppointmentDate && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Próxima Cita</label>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatNextAppointmentDate(consultation.nextAppointmentDate)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Información médica */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-500" />
                      Información Médica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Motivo de Consulta</label>
                      <p className="text-sm bg-muted p-3 rounded-md">{consultation.consultationReason}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Diagnóstico</label>
                      <p className="text-sm bg-muted p-3 rounded-md">{consultation.diagnosis}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Indicaciones Médicas</label>
                      <p className="text-sm bg-muted p-3 rounded-md">{consultation.medicalIndications}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Información del paciente */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3">
                      <User className="h-5 w-5 text-purple-500" />
                      Información del Paciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                        <p className="text-sm font-medium">{consultation.patient.firstName} {consultation.patient.lastName}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">DNI</label>
                        <p className="text-sm">{consultation.patient.dni}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Tipo de Paciente</label>
                        <Badge variant={consultation.patient.type === 'ART' ? 'default' : 'secondary'}>
                          {consultation.patient.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          {consultation.patient.phone1}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          {consultation.patient.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                      <p className="text-sm">
                        {consultation.patient.street} {consultation.patient.streetNumber}
                        {consultation.patient.floor && `, Piso ${consultation.patient.floor}`}
                        {consultation.patient.apartment && `, Depto ${consultation.patient.apartment}`}
                        <br />
                        {consultation.patient.city}, {consultation.patient.province} {consultation.patient.postalCode}
                      </p>
                    </div>

                    {consultation.patient.insurance && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Obra Social</label>
                        <p className="text-sm">{consultation.patient.insurance.name} - {consultation.patient.insurance.planName}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Información del médico */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-orange-500" />
                      Información del Médico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Médico</label>
                        <p className="text-sm font-medium">
                          {consultation.doctor.user.firstName} {consultation.doctor.user.lastName}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Matrícula</label>
                        <p className="text-sm">{consultation.doctor.licenseNumber}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Especialidad</label>
                      <p className="text-sm">{consultation.doctor.specialty.name}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Información del establecimiento médico */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3">
                      <Building className="h-5 w-5 text-indigo-500" />
                      Establecimiento Médico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                        <p className="text-sm font-medium">{consultation.medicalEstablishment.name}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">CUIT</label>
                        <p className="text-sm">{consultation.medicalEstablishment.cuit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detalles ART (si aplica) */}
                {consultation.artDetails && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Detalles del Accidente Laboral
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Fecha del Accidente</label>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatConsultationDate(consultation.artDetails.accidentDateTime)}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Inicio de Ausencia</label>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatConsultationDate(consultation.artDetails.workAbsenceStartDateTime)}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Primera Atención</label>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatConsultationDate(consultation.artDetails.firstMedicalAttentionDateTime)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Establecimiento del Accidente</label>
                          <p className="text-sm">{consultation.artDetails.accidentEstablishmentName}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Contacto</label>
                          <p className="text-sm">{consultation.artDetails.accidentContactName}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Dirección del Establecimiento</label>
                        <p className="text-sm">{consultation.artDetails.accidentEstablishmentAddress}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            {consultation.artDetails.accidentEstablishmentPhone}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Celular Contacto</label>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            {consultation.artDetails.accidentContactCellphone}
                          </div>
                        </div>
                      </div>

                      {consultation.artDetails.accidentContactEmail && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Email Contacto</label>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4" />
                            {consultation.artDetails.accidentContactEmail}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {consultation.artDetails.probableDischargeDate && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Fecha Probable de Alta</label>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              {formatConsultationDate(consultation.artDetails.probableDischargeDate)}
                            </div>
                          </div>
                        )}
                        
                        {consultation.artDetails.nextRevisionDate && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Próxima Revisión</label>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              {formatConsultationDate(consultation.artDetails.nextRevisionDate)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Licencia Médica Laboral</label>
                        <Badge variant={consultation.artDetails.workSickLeave ? 'default' : 'secondary'}>
                          {consultation.artDetails.workSickLeave ? 'Sí' : 'No'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            size="lg"
            className="px-8"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
