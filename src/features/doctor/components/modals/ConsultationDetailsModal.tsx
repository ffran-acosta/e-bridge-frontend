'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Calendar, FileText, MapPin, User, Stethoscope, Building, Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../../constants/endpoints';

interface ConsultationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
}

interface ConsultationDetails {
  id: string;
  patientId: string;
  doctorId: string;
  medicalEstablishmentId: string;
  type: 'INGRESO' | 'ATENCION' | 'ALTA' | 'REINGRESO';
  consultationReason: string;
  diagnosis: string;
  medicalIndications: string;
  nextAppointmentDate: string | null;
  createdAt: string;
  updatedAt: string;
  medicalAssistancePlace: string | null;
  medicalAssistanceDate: string | null;
  patientSignature: string | null;
  doctorSignature: string | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    gender: string;
    birthdate: string;
    type: 'NORMAL' | 'ART';
    currentStatus: string;
    phone1: string;
    email: string;
    siniestro?: {
      id: string;
      contingencyType: string;
      accidentDateTime: string;
      status: string;
      art: {
        name: string;
        code: string;
      };
      employer: {
        name: string;
        cuit: string;
      };
    };
  };
  doctor: {
    id: string;
    licenseNumber: string;
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
  };
  medicalEstablishment: {
    id: string;
    name: string;
    cuit: string;
  };
  artDetails?: {
    accidentDateTime: string;
    workAbsenceStartDateTime: string;
    firstMedicalAttentionDateTime: string;
    workSickLeave: boolean;
    probableDischargeDate: string;
    workReturnDate: string;
    accidentEstablishmentName: string;
    accidentEstablishmentAddress: string;
    accidentEstablishmentPhone: string;
    accidentContactName: string;
    accidentContactCellphone: string;
    accidentContactEmail: string;
  };
}

export function ConsultationDetailsModal({
  isOpen,
  onClose,
  consultationId,
}: ConsultationDetailsModalProps) {
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && consultationId) {
      fetchConsultationDetails();
    }
  }, [isOpen, consultationId]);

  const fetchConsultationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api<{ data: ConsultationDetails }>(
        DOCTOR_ENDPOINTS.consultationById(consultationId)
      );
      setConsultation(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los detalles');
    } finally {
      setLoading(false);
    }
  };

  const getConsultationTypeLabel = (type: string) => {
    const labels = {
      'INGRESO': 'Ingreso',
      'ATENCION': 'Atención',
      'ALTA': 'Alta Médica',
      'REINGRESO': 'Reingreso'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getConsultationTypeVariant = (type: string) => {
    const variants = {
      'INGRESO': 'default',
      'ATENCION': 'secondary',
      'ALTA': 'destructive',
      'REINGRESO': 'outline'
    };
    return variants[type as keyof typeof variants] || 'default';
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatDateOnly = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No especificado';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Detalles de la Consulta
          </DialogTitle>
          <DialogDescription>
            Información completa de la consulta médica
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-destructive">{error}</p>
                  <Button onClick={fetchConsultationDetails} className="mt-2">
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : consultation ? (
              <div className="space-y-6">
                {/* Header con información básica */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">
                          {consultation.consultationReason}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(consultation.createdAt)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={getConsultationTypeVariant(consultation.type) as any}>
                            {getConsultationTypeLabel(consultation.type)}
                        </Badge>
                        {consultation.patient?.type === 'ART' && (
                          <Badge variant="outline">Caso ART</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Información del paciente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información del Paciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {consultation.patient ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Nombre Completo</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.patient.firstName} {consultation.patient.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">DNI</p>
                          <p className="text-sm text-muted-foreground">{consultation.patient.dni}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-sm text-muted-foreground">{consultation.patient.phone1}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{consultation.patient.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Información del paciente no disponible</p>
                    )}
                    
                    {consultation.patient?.siniestro && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Información del Siniestro ART</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">ART:</p>
                              <p className="text-muted-foreground">
                                {consultation.patient.siniestro.art?.name} ({consultation.patient.siniestro.art?.code})
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Empleador:</p>
                              <p className="text-muted-foreground">{consultation.patient.siniestro.employer?.name}</p>
                            </div>
                            <div>
                              <p className="font-medium">Tipo de Contingencia:</p>
                              <p className="text-muted-foreground">{consultation.patient.siniestro.contingencyType}</p>
                            </div>
                            <div>
                              <p className="font-medium">Estado:</p>
                              <p className="text-muted-foreground">{consultation.patient.siniestro.status}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Información médica */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Información Médica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Diagnóstico</p>
                      <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Indicaciones Médicas</p>
                      <p className="text-sm text-muted-foreground">{consultation.medicalIndications}</p>
                    </div>
                    {consultation.nextAppointmentDate && (
                      <div>
                        <p className="text-sm font-medium mb-2">Próxima Cita</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(consultation.nextAppointmentDate)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Información del doctor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Médico Tratante
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {consultation.doctor ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Nombre</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.doctor.user?.firstName} {consultation.doctor.user?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Matrícula</p>
                          <p className="text-sm text-muted-foreground">{consultation.doctor.licenseNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Especialidad</p>
                          <p className="text-sm text-muted-foreground">{consultation.doctor.specialty?.name}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Información del doctor no disponible</p>
                    )}
                  </CardContent>
                </Card>

                {/* Establecimiento médico */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Establecimiento Médico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {consultation.medicalEstablishment ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Nombre</p>
                          <p className="text-sm text-muted-foreground">{consultation.medicalEstablishment.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">CUIT</p>
                          <p className="text-sm text-muted-foreground">{consultation.medicalEstablishment.cuit}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Información del establecimiento no disponible</p>
                    )}
                  </CardContent>
                </Card>

                {/* Detalles ART (si aplica) */}
                {consultation.artDetails && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Detalles del Accidente Laboral
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Fecha del Accidente</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(consultation.artDetails.accidentDateTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Inicio de Ausencia</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(consultation.artDetails.workAbsenceStartDateTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Primera Atención</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(consultation.artDetails.firstMedicalAttentionDateTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Licencia Médica</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.artDetails.workSickLeave ? 'Sí' : 'No'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fecha Probable de Alta</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateOnly(consultation.artDetails.probableDischargeDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Retorno al Trabajo</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(consultation.artDetails.workReturnDate)}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Establecimiento del Accidente</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Nombre:</p>
                            <p className="text-muted-foreground">{consultation.artDetails.accidentEstablishmentName}</p>
                          </div>
                          <div>
                            <p className="font-medium">Dirección:</p>
                            <p className="text-muted-foreground">{consultation.artDetails.accidentEstablishmentAddress}</p>
                          </div>
                          <div>
                            <p className="font-medium">Teléfono:</p>
                            <p className="text-muted-foreground">{consultation.artDetails.accidentEstablishmentPhone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Contacto del Accidente</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Nombre:</p>
                            <p className="text-muted-foreground">{consultation.artDetails.accidentContactName}</p>
                          </div>
                          <div>
                            <p className="font-medium">Celular:</p>
                            <p className="text-muted-foreground">{consultation.artDetails.accidentContactCellphone}</p>
                          </div>
                          <div>
                            <p className="font-medium">Email:</p>
                            <p className="text-muted-foreground">{consultation.artDetails.accidentContactEmail}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Botón de cerrar */}
                <div className="flex justify-end pt-4">
                  <Button onClick={onClose}>
                    Cerrar
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
