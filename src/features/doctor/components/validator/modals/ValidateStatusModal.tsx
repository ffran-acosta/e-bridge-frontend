'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, XCircle, User, CreditCard, FileText } from 'lucide-react';
import { eligibilitySchema, type EligibilityFormData } from '../schemas/eligibility.schema';
import { PatientIdentifierFields } from '../components/PatientIdentifierFields';
import { useValidateEligibility } from '../hooks/useValidateEligibility';

interface ValidateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

export function ValidateStatusModal({ 
  isOpen, 
  onClose,
  onSuccess 
}: ValidateStatusModalProps) {
  const form = useForm<EligibilityFormData>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      codigoSocio: '',
    },
  });

  const { 
    validateEligibility, 
    isLoading, 
    error, 
    result,
    clearError,
    clearResult 
  } = useValidateEligibility();

  const handleClose = () => {
    form.reset();
    clearError();
    clearResult();
    onClose();
  };

  const onSubmit = async (data: EligibilityFormData) => {
    clearError();
    clearResult();
    
    try {
      const response = await validateEligibility(data.codigoSocio);
      if (response && onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      // El error ya se maneja en el hook
      console.error('Error al validar eligibilidad:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Validar Estado del Paciente</DialogTitle>
          <DialogDescription>
            Ingrese el número de socio para verificar su elegibilidad en la base de datos de Avalian
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del formulario */}
          <PatientIdentifierFields form={form} />

          {/* Error del formulario */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Resultado */}
          {result && (
            <>
              {result.status === 'OK' && result.socio ? (
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Socio Encontrado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Código de Socio</label>
                        <div className="flex items-center gap-2 text-sm">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono">{result.socio.codigo}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Plan</label>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{result.socio.plan}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Apellido</label>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{result.socio.apellido}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{result.socio.nombre}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        ID Transacción: <span className="font-mono">{result.idTransaccion}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">Socio no encontrado</p>
                      <p className="text-sm">{result.mensaje}</p>
                      {result.idTransaccion && (
                        <p className="text-xs mt-2 text-muted-foreground">
                          ID Transacción: <span className="font-mono">{result.idTransaccion}</span>
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Validar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
