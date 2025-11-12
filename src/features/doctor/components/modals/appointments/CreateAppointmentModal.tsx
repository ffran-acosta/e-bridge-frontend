"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { CreateAppointmentForm } from './CreateAppointmentForm';
import { useCreateAppointment } from '../../../hooks/useCreateAppointment';
import { Calendar } from 'lucide-react';
import type { AppointmentFormData } from '../../../lib/appointment-form.schema';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  doctorId: string;
  onSuccess?: () => void;
}

export function CreateAppointmentModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  doctorId,
  onSuccess,
}: CreateAppointmentModalProps) {
  const { createAppointment, isLoading, error, clearError } = useCreateAppointment({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      console.error('❌ Error al crear turno:', err);
    },
  });

  const handleSubmit = (data: AppointmentFormData) => {
    createAppointment(data);
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col sm:max-w-4xl">
        <DialogHeader className="flex-shrink-0 pb-6 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Crear Nuevo Turno
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Programar un nuevo turno para <strong>{patientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <CreateAppointmentForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            patientId={patientId}
            doctorId={doctorId}
            patientName={patientName}
            onCancel={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
