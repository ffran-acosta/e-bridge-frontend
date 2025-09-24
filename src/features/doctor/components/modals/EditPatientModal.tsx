"use client";

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { useEditPatient } from '../../hooks/useEditPatient';
import { EditPatientForm } from './EditPatientForm';
import { cn } from '@/lib/utils';
import { PatientProfile } from '@/shared/types/patients.types';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientData?: PatientProfile;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function EditPatientModal({
  isOpen,
  onClose,
  patientId,
  patientData,
  onSuccess,
  onError,
}: EditPatientModalProps) {
  const {
    form,
    handleSubmit,
    isSubmitting,
    error,
    clearError,
  } = useEditPatient({
    patientId,
    patientData,
    onSuccess: () => {
      console.log('✅ Paciente editado exitosamente');
      onSuccess?.();
      onClose();
    },
    onError,
  });

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const title = 'Editar Paciente';
  const description = 'Modificar los datos del paciente';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col",
          "bg-background border rounded-lg shadow-lg",
          "sm:max-w-4xl md:max-w-5xl lg:max-w-6xl"
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
            <EditPatientForm
              form={form}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
              onClose={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

