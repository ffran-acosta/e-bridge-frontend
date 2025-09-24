"use client";

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { ConsultationTypeSelectorModal } from './ConsultationTypeSelectorModal';

interface CreateConsultationButtonProps {
  patientId: string;
  patientName: string;
  hasConsultations: boolean;
  onConsultationTypeSelected: (type: 'INGRESO' | 'ATENCION' | 'ALTA') => void;
}

export function CreateConsultationButton({
  patientId,
  patientName,
  hasConsultations,
  onConsultationTypeSelected,
}: CreateConsultationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('🎯 CreateConsultationButton: Componente renderizado con props:', {
    patientId,
    patientName,
    hasConsultations,
    isModalOpen
  });

  const handleSelectType = (type: 'INGRESO' | 'ATENCION' | 'ALTA') => {
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
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        size="sm"
      >
        <Plus className="h-4 w-4" />
        Nueva Consulta ART
      </Button>

      <ConsultationTypeSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientName={patientName}
        hasConsultations={hasConsultations}
        onSelectType={handleSelectType}
      />
    </>
  );
}
