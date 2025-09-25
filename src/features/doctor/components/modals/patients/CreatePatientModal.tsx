"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { useCreatePatient, useInsurances } from '../../../hooks/useCreatePatient';
import { GENDER_OPTIONS, PATIENT_TYPE_OPTIONS } from '../../../types/patient-form.types';
import { CreatePatientForm } from './CreatePatientForm';
import { CreateSiniestroModal } from '../siniestros/CreateSiniestroModal';
import { cn } from '@/lib/utils';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'NORMAL' | 'ART';
  onSuccess?: (patient: any) => void;
  onError?: (error: string) => void;
}

export function CreatePatientModal({
  isOpen,
  onClose,
  defaultType = 'NORMAL',
  onSuccess,
  onError,
}: CreatePatientModalProps) {
  const [isSiniestroModalOpen, setIsSiniestroModalOpen] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<any>(null);
  const {
    form,
    handleSubmit,
    isSubmitting,
    error,
    clearError,
  } = useCreatePatient({
    defaultType,
    onSuccess: (patient) => {
      console.log('🎯 Paciente creado exitosamente:', patient);
      const patientType = patient.data?.data?.type;
      const patientData = patient.data?.data;
      console.log('🔍 Tipo de paciente:', patientType);
      console.log('🔍 Datos del paciente:', patientData);
      
      // Si es un paciente ART, verificar si ya tiene siniestro
      if (patientType === 'ART') {
        console.log('🚀 Paciente ART creado, verificando siniestro...');
        
        // Verificar si el paciente ya tiene siniestro
        if (patientData?.siniestro) {
          console.log('⚠️ El paciente ART ya tiene un siniestro asociado:', patientData.siniestro);
          console.log('✅ Cerrando modal - siniestro ya existe');
          onSuccess?.(patient);
          onClose();
        } else {
          console.log('🚀 Abriendo modal de siniestro para paciente ART sin siniestro');
          setCreatedPatient(patient);
          setIsSiniestroModalOpen(true);
        }
      } else {
        console.log('✅ Paciente NORMAL, cerrando modal normalmente');
        // Si es paciente NORMAL, cerrar modal normalmente
        onSuccess?.(patient);
        onClose();
      }
    },
    onError,
  });

  const {
    insurances,
    loading: insurancesLoading,
    error: insurancesError,
    fetchInsurances,
  } = useInsurances();

  // Cargar obras sociales cuando se abre el modal
  useEffect(() => {
    console.log('🔄 useEffect ejecutado:', { isOpen, insurancesLength: insurances.length, insurancesLoading });
    if (isOpen && insurances.length === 0 && !insurancesLoading) {
      console.log('🚀 Llamando fetchInsurances...');
      fetchInsurances();
    }
  }, [isOpen, insurances.length, fetchInsurances]); // Removido insurancesLoading de las dependencias

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearError();
      setCreatedPatient(null);
      setIsSiniestroModalOpen(false);
    }
  }, [isOpen, clearError]);

  // Manejar el cierre del modal de siniestro
  const handleSiniestroClose = () => {
    setIsSiniestroModalOpen(false);
    onSuccess?.(createdPatient);
    onClose();
  };

  // Manejar el éxito del siniestro
  const handleSiniestroSuccess = (siniestro: any) => {
    console.log('✅ Siniestro creado exitosamente:', siniestro);
    // Aquí podríamos abrir el modal de consulta INGRESO si fuera necesario
    handleSiniestroClose();
  };

  // Debug: Log del estado del modal de siniestro
  useEffect(() => {
    console.log('🔍 Estado del modal de siniestro:', {
      isSiniestroModalOpen,
      createdPatient: createdPatient ? { 
        id: createdPatient.data?.data?.id, 
        type: createdPatient.data?.data?.type,
        name: `${createdPatient.data?.data?.firstName} ${createdPatient.data?.data?.lastName}`
      } : null
    });
  }, [isSiniestroModalOpen, createdPatient]);

  const title = defaultType === 'ART' 
    ? 'Crear Paciente ART' 
    : 'Crear Paciente';

  const description = defaultType === 'ART'
    ? 'Crear un nuevo paciente con cobertura de ART (Aseguradora de Riesgos del Trabajo)'
    : 'Crear un nuevo paciente con obra social o particular';

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
            <CreatePatientForm
              form={form as any}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
              insurances={insurances}
              insurancesLoading={insurancesLoading}
              insurancesError={insurancesError}
              genderOptions={GENDER_OPTIONS}
              patientTypeOptions={PATIENT_TYPE_OPTIONS}
              defaultType={defaultType}
              onClose={onClose}
            />
          </div>
        </div>
      </DialogContent>

      {/* Modal de Siniestro para pacientes ART - solo si NO tiene siniestro */}
      {createdPatient && !createdPatient.data?.data?.siniestro && (
        <CreateSiniestroModal
          isOpen={isSiniestroModalOpen}
          onClose={handleSiniestroClose}
          patientId={createdPatient.data?.data?.id}
          patientName={`${createdPatient.data?.data?.firstName} ${createdPatient.data?.data?.lastName}`}
          onSuccess={handleSiniestroSuccess}
          onError={onError}
        />
      )}
    </Dialog>
  );
}
