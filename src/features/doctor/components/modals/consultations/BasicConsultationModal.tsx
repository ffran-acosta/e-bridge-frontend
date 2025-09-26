"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { BasicConsultationForm } from './BasicConsultationForm';
import { useCreateBasicConsultation } from '../../../hooks/useCreateBasicConsultation';
import { useMedicalEstablishments } from '../../../hooks/useCreateSiniestro';
import { Stethoscope } from 'lucide-react';
import { useEffect } from 'react';

interface BasicConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSuccess?: () => void;
}

export function BasicConsultationModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSuccess,
}: BasicConsultationModalProps) {
  const { createBasicConsultation, isLoading, error, clearError } = useCreateBasicConsultation({
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      console.error('❌ Error al crear consulta básica:', err);
    },
  });

  const { establishments, loading: establishmentsLoading, fetchEstablishments } = useMedicalEstablishments();

  useEffect(() => {
    if (isOpen) {
      fetchEstablishments();
    }
  }, [isOpen, fetchEstablishments]);

  const handleSubmit = (data: any) => {
    createBasicConsultation(patientId, data);
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            Consulta Médica Básica
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Crear una nueva consulta médica para <strong>{patientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <BasicConsultationForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            medicalEstablishments={establishments}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
