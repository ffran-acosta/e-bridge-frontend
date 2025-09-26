"use client";

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateAppointmentModal } from './CreateAppointmentModal';

interface CreateAppointmentButtonProps {
  patientId: string;
  patientName: string;
  doctorId: string;
  hasAppointments?: boolean;
  className?: string;
  onAppointmentSuccess?: () => void;
}

export function CreateAppointmentButton({
  patientId,
  patientName,
  doctorId,
  hasAppointments = false,
  className,
  onAppointmentSuccess,
}: CreateAppointmentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log('🎯 CreateAppointmentButton: Abriendo modal para crear turno');
    console.log('🎯 Paciente:', patientName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    console.log('✅ Turno creado exitosamente');
    onAppointmentSuccess?.();
    handleCloseModal();
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className={cn(
          "flex items-center gap-2",
          hasAppointments && "h-8 px-3 text-sm",
          className
        )}
        variant={hasAppointments ? "outline" : "default"}
        size="sm"
      >
        <Plus className="h-3 w-3 mr-1" />
        {hasAppointments ? 'Nuevo Turno' : 'Crear Turno'}
      </Button>

      {/* Modal para crear turno */}
      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patientId={patientId}
        patientName={patientName}
        doctorId={doctorId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
