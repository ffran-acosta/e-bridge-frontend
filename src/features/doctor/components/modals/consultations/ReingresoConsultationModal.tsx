"use client";

import React from 'react';
import type { PatientProfile } from '@/shared/types/patients.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { useCreateReingresoConsultation } from '../../../hooks/useCreateReingresoConsultation';
import { useMedicalEstablishments } from '../../../hooks/useCreateSiniestro'; // Reusing hook for establishments
import { ReingresoConsultationForm } from './ReingresoConsultationForm';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ReingresoConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  siniestroData?: PatientProfile['siniestro'];
  onSuccess?: (consultation: unknown) => void;
  onError?: (error: string) => void;
}

export function ReingresoConsultationModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  siniestroData,
  onSuccess,
  onError,
}: ReingresoConsultationModalProps) {
  const { form, handleSubmit, isSubmitting, error, clearError } = useCreateReingresoConsultation({
    patientId,
    onSuccess: (consultation) => {
      onSuccess?.(consultation);
      onClose();
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  const { establishments: medicalEstablishments, loading: establishmentsLoading, error: establishmentsError, fetchEstablishments } = useMedicalEstablishments();

  // Cargar establecimientos cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      fetchEstablishments();
    }
  }, [isOpen, fetchEstablishments]);

  // Preseleccionar establecimiento médico del siniestro
  React.useEffect(() => {
    if (siniestroData?.medicalEstablishment?.id && medicalEstablishments.length > 0) {
      console.log('🎯 Preseleccionando establecimiento del siniestro:', siniestroData.medicalEstablishment);
      form.setValue('medicalEstablishmentId', siniestroData.medicalEstablishment.id);
    }
  }, [siniestroData, medicalEstablishments, form]);

  const handleClose = () => {
    form.reset();
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col",
          "bg-background border rounded-lg shadow-lg",
          "sm:max-w-6xl" // Sobrescribir el sm:max-w-lg del componente base
        )}
      >
        <DialogHeader className="flex-shrink-0 pb-6 border-b">
          <DialogTitle className="sr-only">Consulta de Reingreso</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para crear una consulta de reingreso médico
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
            {establishmentsLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">Cargando establecimientos médicos...</span>
                </div>
              </div>
            )}

            {establishmentsError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-destructive text-sm">Error al cargar establecimientos médicos: {establishmentsError}</p>
              </div>
            )}

            {!establishmentsLoading && !establishmentsError && medicalEstablishments && (
              <ReingresoConsultationForm
                form={form}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
                patientName={patientName}
                medicalEstablishments={medicalEstablishments}
                siniestroData={siniestroData}
                onClose={handleClose}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
