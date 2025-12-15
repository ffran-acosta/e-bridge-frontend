'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useDeleteConsultation } from '../../../hooks/useDeleteConsultation';
import { ConsultationTypeBadge } from '@/features/doctor/components/shared/ConsultationTypeBadge';

interface DeleteConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
  consultationType: string;
  consultationDate: string;
  onSuccess?: () => void;
}

export function DeleteConsultationModal({
  isOpen,
  onClose,
  consultationId,
  consultationType,
  consultationDate,
  onSuccess,
}: DeleteConsultationModalProps) {
  const { deleteConsultation, isDeleting, error } = useDeleteConsultation({
    onSuccess: () => {
      console.log('✅ Consulta eliminada exitosamente');
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      console.error('❌ Error al eliminar consulta:', error);
    },
  });

  const handleDelete = () => {
    deleteConsultation(consultationId);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Consulta
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la consulta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información de la consulta a eliminar */}
          <div className="bg-muted border border-border rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Tipo:</span>
                <ConsultationTypeBadge type={consultationType} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Fecha:</span>
                <span className="text-sm text-muted-foreground">{formatDate(consultationDate)}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Advertencia */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 dark:bg-orange-900/20 dark:border-orange-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Advertencia
                </p>
                <p className="text-orange-700 dark:text-orange-300 mt-1">
                  Al eliminar esta consulta, se perderá toda la información médica asociada.
                  Esta acción es irreversible.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? 'Eliminando...' : 'Eliminar Consulta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
