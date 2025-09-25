"use client";

import { useState } from 'react';
import { Button } from '@/shared';
import { Plus } from 'lucide-react';
import { CreatePatientModal } from '../modals';
import { CreatePatientResponse } from '../../types/patient-form.types';

interface CreatePatientButtonProps {
  defaultType?: 'NORMAL' | 'ART';
  onPatientCreated?: (patient: CreatePatientResponse) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CreatePatientButton({
  defaultType = 'NORMAL',
  onPatientCreated,
  variant = 'default',
  size = 'default',
  className,
}: CreatePatientButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = (patient: CreatePatientResponse) => {
    onPatientCreated?.(patient);
    setIsModalOpen(false);
  };

  const handleError = (error: string) => {
    console.error('Error creating patient:', error);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        className={className}
      >
        <Plus className="h-4 w-4 mr-2" />
        {defaultType === 'ART' ? 'Nuevo Paciente ART' : 'Nuevo Paciente'}
      </Button>

      <CreatePatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={defaultType}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
}
