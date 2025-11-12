"use client";

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { ConsultationTypeSelectorModal } from './ConsultationTypeSelectorModal';
import type { PatientProfile } from '@/shared/types/patients.types';

interface CreateConsultationButtonProps {
  patientId: string;
  patientName: string;
  hasConsultations: boolean;
  siniestroData?: PatientProfile['siniestro'];
  onConsultationTypeSelected: (type: 'INGRESO' | 'ATENCION' | 'ALTA' | 'REINGRESO') => void;
  onConsultationSuccess?: (consultation: unknown) => void;
}

export function CreateConsultationButton({
  patientId,
  patientName,
  hasConsultations,
  siniestroData,
  onConsultationTypeSelected,
  onConsultationSuccess,
}: CreateConsultationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('🎯 CreateConsultationButton: Componente renderizado con props:', {
    patientId,
    patientName,
    hasConsultations,
    isModalOpen
  });

  const handleSelectType = (type: 'INGRESO' | 'ATENCION' | 'ALTA' | 'REINGRESO') => {
    console.log('🎯 CreateConsultationButton: Tipo seleccionado:', type);
    onConsultationTypeSelected(type);
  };

  const handleButtonClick = () => {
    console.log('🎯 CreateConsultationButton: Botón clickeado, abriendo modal...');
    setIsModalOpen(true);
  };

  return (
    <>
      <Button 
        onClick={handleButtonClick}
        className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        size="sm"
      >
        <Plus className="h-3 w-3" />
        {hasConsultations ? 'Nueva Consulta' : 'Nueva Consulta ART'}
      </Button>

      <ConsultationTypeSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientName={patientName}
        patientId={patientId}
        hasConsultations={hasConsultations}
        siniestroData={siniestroData}
        onSelectType={handleSelectType}
        onConsultationSuccess={onConsultationSuccess}
      />
    </>
  );
}
