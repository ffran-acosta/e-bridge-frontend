"use client";

import React from 'react';
import type { PatientProfile } from '@/shared/types/patients.types';
import { Dialog, DialogContent, DialogHeader } from '@/shared';
import { useCreateIngresoConsultation } from '../../../hooks/useCreateIngresoConsultation';
import { useMedicalEstablishments } from '../../../hooks/useCreateSiniestro';
import { IngresoConsultationForm } from './IngresoConsultationForm';
import { cn } from '@/lib/utils';

interface IngresoConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  siniestroData?: PatientProfile['siniestro'];
  onSuccess?: (consultation: unknown) => void;
  onError?: (error: string) => void;
}

export function IngresoConsultationModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  siniestroData,
  onSuccess,
  onError,
}: IngresoConsultationModalProps) {
  const {
    form,
    handleSubmit,
    isSubmitting,
    error,
    clearError,
  } = useCreateIngresoConsultation({
    patientId,
    siniestroData,
    onSuccess: (consultation) => {
      console.log('✅ Consulta de INGRESO creada exitosamente:', consultation);
      onSuccess?.(consultation);
      onClose();
    },
    onError,
  });

  const {
    establishments,
    loading: establishmentsLoading,
    error: establishmentsError,
    fetchEstablishments,
  } = useMedicalEstablishments();

  // Cargar establecimientos cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && establishments.length === 0) {
      fetchEstablishments();
    }
  }, [isOpen, establishments.length, fetchEstablishments]);

  // Limpiar errores cuando se cierra el modal
  React.useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-7xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col",
          "bg-background border rounded-lg shadow-lg",
          "sm:max-w-7xl" // Sobrescribir el sm:max-w-lg del componente base
        )}
      >
        <DialogHeader className="flex-shrink-0 pb-6 border-b">
          {/* Título removido - se muestra en el formulario con icono */}
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
            {establishmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando establecimientos médicos...</p>
                </div>
              </div>
            ) : establishmentsError ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-500 mb-4">Error al cargar establecimientos médicos</p>
                  <p className="text-sm text-muted-foreground">{establishmentsError}</p>
                </div>
              </div>
            ) : (
              <IngresoConsultationForm
                form={form}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
                patientName={patientName}
                medicalEstablishments={establishments}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
