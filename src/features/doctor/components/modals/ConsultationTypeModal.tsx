"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Stethoscope, FileText } from 'lucide-react';

interface ConsultationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'ATENCION' | 'ALTA') => void;
  patientName: string;
}

export function ConsultationTypeModal({
  isOpen,
  onClose,
  onSelectType,
  patientName,
}: ConsultationTypeModalProps) {
  const [selectedType, setSelectedType] = useState<'ATENCION' | 'ALTA' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onSelectType(selectedType);
      onClose();
    }
  };

  const consultationTypes = [
    {
      type: 'ATENCION' as const,
      title: 'Consulta de ATENCIÓN',
      description: 'Consulta de seguimiento y control del tratamiento',
      icon: Stethoscope,
      primaryColor: 'primary',
      secondaryColor: 'blue',
    },
    {
      type: 'ALTA' as const,
      title: 'Consulta de ALTA',
      description: 'Consulta final que cierra el tratamiento',
      icon: FileText,
      primaryColor: 'green',
      secondaryColor: 'emerald',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Continuar Siniestro</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de consulta para el paciente <strong>{patientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4">
            {consultationTypes.map((consultationType) => {
              const Icon = consultationType.icon;
              const isSelected = selectedType === consultationType.type;
              
              return (
                <Card
                  key={consultationType.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'bg-primary/5 border-primary border-2 shadow-md'
                      : 'bg-card border-border hover:shadow-sm hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedType(consultationType.type)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{consultationType.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {consultationType.description}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-background scale-50" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!selectedType}
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
