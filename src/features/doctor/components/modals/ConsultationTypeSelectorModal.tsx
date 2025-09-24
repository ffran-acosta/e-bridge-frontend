"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Stethoscope, 
  UserCheck, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';

interface ConsultationTypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  hasConsultations: boolean;
  onSelectType: (type: 'INGRESO' | 'ATENCION' | 'ALTA') => void;
}

export function ConsultationTypeSelectorModal({
  isOpen,
  onClose,
  patientName,
  hasConsultations,
  onSelectType,
}: ConsultationTypeSelectorModalProps) {

  const getAvailableTypes = () => {
    if (!hasConsultations) {
      // Paciente ART sin consultas - solo puede hacer INGRESO
      return [
        {
          type: 'INGRESO' as const,
          title: 'Consulta de Ingreso ART',
          description: 'Primera consulta para caso de accidente laboral',
          icon: Stethoscope,
          variant: 'default' as const,
          available: true,
          required: true
        }
      ];
    }

    // Paciente ART con consultas - puede hacer ATENCIÓN o ALTA
    return [
      {
        type: 'ATENCION' as const,
        title: 'Consulta de Atención',
        description: 'Seguimiento y control del tratamiento',
        icon: UserCheck,
        variant: 'secondary' as const,
        available: true
      },
      {
        type: 'ALTA' as const,
        title: 'Consulta de Alta Médica',
        description: 'Finalización del tratamiento y alta del paciente',
        icon: CheckCircle,
        variant: 'destructive' as const,
        available: true
      }
    ];
  };

  const availableTypes = getAvailableTypes();

  const handleSelectType = (type: 'INGRESO' | 'ATENCION' | 'ALTA') => {
    console.log('🎯 ConsultationTypeSelectorModal: Tipo seleccionado:', type);
    onSelectType(type);
    onClose();
  };

  console.log('🎯 ConsultationTypeSelectorModal: Renderizando con props:', {
    isOpen,
    patientName,
    hasConsultations
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Nueva Consulta ART - {patientName}
          </DialogTitle>
          <DialogDescription>
            Selecciona el tipo de consulta a crear para este paciente ART
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Badge variant="outline">Caso ART</Badge>
              {!hasConsultations && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Requiere consulta de ingreso</span>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del flujo ART */}
          <div className="bg-muted border border-border rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-accent mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Flujo de Consultas ART</p>
                <div className="mt-1 text-muted-foreground">
                  {!hasConsultations ? (
                    <p>1. <strong>INGRESO</strong> → Primera consulta obligatoria</p>
                  ) : (
                    <div className="space-y-1">
                      <p>✓ INGRESO completado</p>
                      <p>2. <strong>ATENCIÓN</strong> → Seguimiento del tratamiento</p>
                      <p>3. <strong>ALTA</strong> → Finalización y alta médica</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Opciones de consulta */}
          <div className="grid gap-3">
            {availableTypes.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={option.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    option.available 
                      ? 'hover:border-primary' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => option.available && handleSelectType(option.type)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          option.variant === 'default' ? 'bg-primary/20 text-primary' :
                          option.variant === 'secondary' ? 'bg-accent/20 text-accent' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {option.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={option.variant}
                          className={
                            option.variant === 'default' ? 'bg-primary text-primary-foreground' :
                            option.variant === 'secondary' ? 'bg-accent text-accent-foreground' :
                            'bg-destructive text-destructive-foreground'
                          }
                        >
                          {option.type}
                        </Badge>
                        {option.available && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Botón cancelar */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
