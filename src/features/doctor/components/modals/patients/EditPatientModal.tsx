"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { useEditPatient } from '../../../hooks/useEditPatient';
import { useInsurances } from '../../../hooks/useCreatePatient'; // Reusing hook for insurances
import { EditPatientForm } from './EditPatientForm';
import { cn } from '@/lib/utils';
import { AlertCircle, User } from 'lucide-react';
import type { PatientProfile, PatientProfileResponse } from '@/shared/types/patients.types';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  patientData?: Partial<PatientProfile> | null; // Datos del paciente para precargar
  onSuccess?: (patient: PatientProfileResponse) => void;
  onError?: (error: string) => void;
}

export function EditPatientModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  patientData,
  onSuccess,
  onError,
}: EditPatientModalProps) {
  const { form, handleSubmit, isSubmitting, error, clearError } = useEditPatient({
    patientId,
    patientData,
    onSuccess: (patient) => {
      onSuccess?.(patient);
      onClose();
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  const { insurances, loading: insurancesLoading, error: insurancesError, fetchInsurances } = useInsurances();

  // Cargar insurances cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && insurances.length === 0) {
      fetchInsurances();
    }
  }, [isOpen, insurances.length, fetchInsurances]);

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
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Editar Paciente
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            Modifica la información del paciente <span className="font-medium">{patientName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
            {insurancesLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">Cargando obras sociales...</span>
                </div>
              </div>
            )}

            {insurancesError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-destructive text-sm">Error al cargar obras sociales: {insurancesError}</p>
              </div>
            )}

            {!insurancesLoading && !insurancesError && insurances && (
              <EditPatientForm
                form={form}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
                patientName={patientName}
                insurances={insurances}
                onClose={handleClose}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}