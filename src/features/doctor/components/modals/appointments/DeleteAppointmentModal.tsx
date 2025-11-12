"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { useDeleteAppointment } from '../../../hooks/useDeleteAppointment';
import { AlertTriangle, Calendar, Clock, MapPin, Trash2, X } from 'lucide-react';
import { formatAppointmentDate, formatAppointmentTime } from '../../../utils/dateFormatters';

interface DeleteAppointmentModalProps {
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

export function DeleteAppointmentModal({
  isOpen,
  onClose,
  appointment,
  patientName,
  onSuccess,
}: DeleteAppointmentModalProps) {
  const { deleteAppointment, isDeleting, error, clearError } = useDeleteAppointment({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      console.error('❌ Error al eliminar turno:', err);
    },
  });

  const handleDelete = () => {
    deleteAppointment(appointment.id);
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  const medicalEstablishmentInfo = appointment.medicalEstablishment
    ? [appointment.medicalEstablishment.name, appointment.medicalEstablishment.address]
        .filter(Boolean)
        .join(' - ')
    : 'Establecimiento no especificado';

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Turno
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Esta acción no se puede deshacer. El turno será eliminado permanentemente.
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

            {appointment.notes && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>Notas</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Advertencia */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800">
                  ¿Estás seguro de que quieres eliminar este turno?
                </p>
                <p className="text-xs text-red-700">
                  Esta acción eliminará permanentemente el turno del paciente <span className="font-medium">{patientName}</span>.
                </p>
              </div>
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
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar Turno
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



