"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppointmentStatusChange } from '../../../hooks/useAppointmentStatusChange';
import { cn } from '@/lib/utils';
import { AlertTriangle, Calendar, Clock, MapPin, X } from 'lucide-react';
import { formatAppointmentDateTime, formatAppointmentDate, formatAppointmentTime } from '../../../utils/dateFormatters';

interface CancelAppointmentModalProps {
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
  onSuccess?: () => void;
}

export function CancelAppointmentModal({
  isOpen,
  onClose,
  appointment,
  patientName,
  onSuccess,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const medicalEstablishmentInfo = appointment.medicalEstablishment
    ? [appointment.medicalEstablishment.name, appointment.medicalEstablishment.address]
        .filter(Boolean)
        .join(' - ')
    : 'Establecimiento no especificado';

  const { cancelAppointment, isUpdating, error, clearError } = useAppointmentStatusChange({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      console.error('❌ Error al cancelar turno:', err);
    },
  });

  const handleCancel = () => {
    if (!reason.trim()) {
      return;
    }
    cancelAppointment(appointment.id, reason.trim(), notes.trim());
  };

  const handleClose = () => {
    setReason('');
    setNotes('');
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Cancelar Turno
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Proporciona el motivo de la cancelación del turno.
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

          {/* Formulario de cancelación */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Motivo de Cancelación <span className="text-red-500">*</span>
              </label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Paciente no se presentó, reprogramación médica..."
                className="text-sm"
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notas Adicionales (Opcional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Información adicional sobre la cancelación..."
                className="min-h-[80px] text-sm"
                disabled={isUpdating}
              />
            </div>
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
            variant="destructive"
            onClick={handleCancel}
            disabled={isUpdating || !reason.trim()}
            className="flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Cancelando...
              </>
            ) : (
              'Confirmar Cancelación'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



