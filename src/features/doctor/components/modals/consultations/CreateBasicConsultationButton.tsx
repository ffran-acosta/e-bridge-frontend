"use client";

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { BasicConsultationModal } from './BasicConsultationModal';
import { Stethoscope, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateBasicConsultationButtonProps {
  patientId: string;
  patientName: string;
  onConsultationSuccess?: () => void;
  hasConsultations?: boolean;
  className?: string;
}

export function CreateBasicConsultationButton({
  patientId,
  patientName,
  onConsultationSuccess,
  hasConsultations = false,
  className,
}: CreateBasicConsultationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    onConsultationSuccess?.();
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className={cn(
          "flex items-center gap-2",
          hasConsultations && "h-8 px-3 text-sm",
          className
        )}
        variant={hasConsultations ? "outline" : "default"}
      >
        {hasConsultations ? (
          <>
            <Plus className="h-4 w-4" />
            <span>Nueva Consulta</span>
          </>
        ) : (
          <>
            <Stethoscope className="h-4 w-4" />
            <span>Crear Consulta Básica</span>
          </>
        )}
      </Button>

      <BasicConsultationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patientId={patientId}
        patientName={patientName}
        onSuccess={handleSuccess}
      />
    </>
  );
}

