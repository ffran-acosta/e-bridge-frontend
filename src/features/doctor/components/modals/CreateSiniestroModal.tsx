"use client";

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { useCreateSiniestro, useARTs, useMedicalEstablishments, useEmployers } from '../../hooks/useCreateSiniestro';
import { CONTINGENCY_TYPE_OPTIONS } from '../../types/siniestro-form.types';
import { CreateSiniestroForm } from './CreateSiniestroForm';
import { cn } from '@/lib/utils';

interface CreateSiniestroModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSuccess?: (siniestro: any) => void;
  onError?: (error: string) => void;
}

export function CreateSiniestroModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSuccess,
  onError,
}: CreateSiniestroModalProps) {
  const {
    form,
    handleSubmit,
    isSubmitting,
    error,
    clearError,
  } = useCreateSiniestro({
    patientId,
    onSuccess: (siniestro) => {
      onSuccess?.(siniestro);
      onClose();
    },
    onError,
  });

  const {
    arts,
    loading: artsLoading,
    error: artsError,
    fetchARTs,
  } = useARTs();

  const {
    establishments,
    loading: establishmentsLoading,
    error: establishmentsError,
    fetchEstablishments,
  } = useMedicalEstablishments();

  const {
    employers,
    loading: employersLoading,
    error: employersError,
    fetchEmployers,
  } = useEmployers();

  // Cargar catálogos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (arts.length === 0) fetchARTs();
      if (establishments.length === 0) fetchEstablishments();
      if (employers.length === 0) fetchEmployers();
    }
  }, [isOpen, arts.length, establishments.length, employers.length, fetchARTs, fetchEstablishments, fetchEmployers]);

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const title = 'Crear Siniestro ART';
  const description = `Crear siniestro para el paciente ${patientName}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col",
          "bg-background border rounded-lg shadow-lg"
        )}
      >
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
            <CreateSiniestroForm
              form={form as any}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
              arts={arts}
              artsLoading={artsLoading}
              artsError={artsError}
              establishments={establishments}
              establishmentsLoading={establishmentsLoading}
              establishmentsError={establishmentsError}
              employers={employers}
              employersLoading={employersLoading}
              employersError={employersError}
              contingencyTypeOptions={CONTINGENCY_TYPE_OPTIONS}
              patientName={patientName}
              onClose={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
