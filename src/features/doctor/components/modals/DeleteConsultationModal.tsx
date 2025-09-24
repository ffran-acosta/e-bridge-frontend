'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import type { Consultation } from '@/shared/types/patients.types';
import { useConsultationsStore } from '../../store/consultationStore';

interface DeleteConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation | null;
  isArtCase: boolean;
  onSuccess?: () => void;
}

export function DeleteConsultationModal({
  isOpen,
  onClose,
  consultation,
  isArtCase,
  onSuccess,
}: DeleteConsultationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteConsultation } = useConsultationsStore();

  const getConsultationTypeLabel = (type: string) => {
    const labels = {
      'INGRESO': 'Ingreso',
      'ATENCION': 'Atención',
      'ALTA': 'Alta Médica',
      'REINGRESO': 'Reingreso'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getDeleteWarning = () => {
    if (!consultation || !isArtCase) {
      return {
        title: 'Confirmar eliminación',
        message: 'Esta acción no se puede deshacer.',
        severity: 'normal' as const
      };
    }

    const consultationType = consultation.consultationType;
    
    if (consultationType === 'INGRESO') {
      return {
        title: '⚠️ CUIDADO: Eliminando consulta de INGRESO ART',
        message: 'Eliminar el INGRESO puede dejar al paciente en estado inconsistente si existen consultas posteriores (ATENCIÓN, ALTA). Se recomienda eliminar las consultas en orden inverso: ALTA → ATENCIÓN → INGRESO.',
        severity: 'high' as const
      };
    }

    return {
      title: 'Confirmar eliminación de consulta ART',
      message: 'Esta acción eliminará la consulta y puede afectar el estado del paciente. Esta acción no se puede deshacer.',
      severity: 'medium' as const
    };
  };

  const handleDelete = async () => {
    if (!consultation) return;

    setIsDeleting(true);
    try {
      await deleteConsultation(consultation.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error al eliminar consulta:', error);
      // El error ya se maneja en el store
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!consultation) return null;

  const warning = getDeleteWarning();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Eliminar Consulta
          </DialogTitle>
          <DialogDescription>
            {warning.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información de la consulta */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Consulta a eliminar:</span>
                {consultation.consultationType && (
                  <Badge variant="outline">
                    {getConsultationTypeLabel(consultation.consultationType)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {consultation.consultationReason}
              </p>
              {isArtCase && (
                <Badge variant="outline" className="text-xs">
                  Caso ART
                </Badge>
              )}
            </div>
          </div>

          {/* Warning message */}
          <div className={`p-4 rounded-lg border-l-4 ${
            warning.severity === 'high' 
              ? 'bg-destructive/10 border-destructive' 
              : warning.severity === 'medium'
              ? 'bg-orange-50 border-orange-500'
              : 'bg-muted border-muted-foreground'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                warning.severity === 'high' 
                  ? 'text-destructive' 
                  : warning.severity === 'medium'
                  ? 'text-orange-500'
                  : 'text-muted-foreground'
              }`} />
              <p className="text-sm">{warning.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? 'Eliminando...' : 'Eliminar Consulta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
