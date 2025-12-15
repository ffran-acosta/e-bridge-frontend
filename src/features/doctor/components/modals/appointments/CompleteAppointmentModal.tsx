"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useAppointmentStatusChange } from '../../../hooks/useAppointmentStatusChange';
import { CheckCircle, Calendar, Clock, MapPin, X } from 'lucide-react';
import { formatAppointmentDate, formatAppointmentTime } from '../../../utils/dateFormatters';
import { ConsultationTypeBadge } from '@/features/doctor/components/shared/ConsultationTypeBadge';

interface CompleteAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    scheduledDateTime: string;
    notes?: string;
    medicalEstablishment?: {
      name: string;
      address?: string;
    };
  };
  patientName: string;
  consultations: Array<{
    id: string;
    consultationType: string;
    createdAt: string;
  }>;
  onSuccess?: () => void;
}

export function CompleteAppointmentModal({
  isOpen,
  onClose,
  appointment,
  patientName,
  consultations,
  onSuccess,
}: CompleteAppointmentModalProps) {
  const [selectedConsultationId, setSelectedConsultationId] = useState('');

  const { completeAppointment, isUpdating, error, clearError } = useAppointmentStatusChange({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      console.error('❌ Error al completar turno:', err);
    },
  });

  const medicalEstablishmentInfo = appointment.medicalEstablishment
    ? [appointment.medicalEstablishment.name, appointment.medicalEstablishment.address]
        .filter(Boolean)
        .join(' - ')
    : 'Establecimiento no especificado';

  const handleComplete = () => {
    if (!selectedConsultationId) {
      return;
    }
    completeAppointment(appointment.id, selectedConsultationId);
  };

  const handleClose = () => {
    setSelectedConsultationId('');
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-status-step-4">
            <CheckCircle className="h-5 w-5" />
            Completar Turno
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground space-y-1">
            <p>Selecciona la consulta médica asociada a este turno.</p>
            <p className="font-medium text-foreground">Paciente: {patientName}</p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información del turno */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Fecha y Hora</span>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-sm font-medium">
                {formatAppointmentDate(appointment.scheduledDateTime)}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatAppointmentTime(appointment.scheduledDateTime)}
              </p>
            </div>

            {appointment.medicalEstablishment && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Establecimiento</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {medicalEstablishmentInfo}
                </p>
              </div>
            )}
          </div>

          {/* Selector de consulta */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Consulta Médica Asociada <span className="text-destructive">*</span>
            </label>
            <Select
              value={selectedConsultationId}
              onValueChange={setSelectedConsultationId}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar consulta..." />
              </SelectTrigger>
              <SelectContent>
                {consultations.map((consultation) => (
                  <SelectItem key={consultation.id} value={consultation.id}>
                    <div className="flex flex-col gap-0.5">
                      <ConsultationTypeBadge type={consultation.consultationType} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(consultation.createdAt).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {consultations.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No hay consultas disponibles para asociar con este turno.
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
              <X className="h-4 w-4 text-destructive" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isUpdating || !selectedConsultationId || consultations.length === 0}
            className="flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Completando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Completar Turno
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



