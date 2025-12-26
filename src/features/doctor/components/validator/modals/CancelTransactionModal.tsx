'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Textarea } from '@/shared/components/ui/textarea';
import { Loader2, AlertCircle, CheckCircle2, XCircle, X } from 'lucide-react';
import { cancelTransactionSchema, type CancelTransactionFormData } from '../schemas/cancel.schema';
import { useCancelTransaction } from '../hooks/useCancelTransaction';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';
import type { Transaction } from '../types';

interface CancelTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSuccess?: (data: any) => void;
}

export function CancelTransactionModal({ 
  isOpen, 
  onClose,
  transaction,
  onSuccess 
}: CancelTransactionModalProps) {
  const form = useForm<CancelTransactionFormData>({
    resolver: zodResolver(cancelTransactionSchema),
    defaultValues: {
      motivo: '',
    },
  });

  const { 
    cancelTransaction, 
    isLoading, 
    error, 
    result,
    clearError,
    clearResult 
  } = useCancelTransaction();

  const handleClose = () => {
    form.reset({
      motivo: '',
    });
    clearError();
    clearResult();
    onClose();
  };

  const onSubmit = async (data: CancelTransactionFormData) => {
    if (!transaction) return;

    clearError();
    clearResult();
    
    try {
      const response = await cancelTransaction({
        codigoSocio: transaction.codigoSocio,
        tipoIdAnul: 'IDTRAN',
        idAnul: transaction.idTransaccion || '',
        motivo: data.motivo || undefined,
      });
      
      if (response && onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      // El error ya se maneja en el hook
      console.error('Error al anular transacción:', err);
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Anular Transacción</DialogTitle>
          <DialogDescription>
            Anular la transacción {transaction.idTransaccion || transaction.id}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Información de la transacción */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Código de Socio:</span>
              <p className="font-mono font-medium">{transaction.codigoSocio}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ID Transacción:</span>
              <p className="font-mono font-medium">{transaction.idTransaccion || '-'}</p>
            </div>
            {transaction.nombreSocio && (
              <div>
                <span className="text-muted-foreground">Socio:</span>
                <p className="font-medium">{transaction.nombreSocio}</p>
              </div>
            )}
          </div>

          {/* Motivo (opcional) */}
          <FormFieldWrapper 
            label="Motivo (opcional)" 
            error={form.formState.errors.motivo?.message}
          >
            <Textarea
              {...form.register('motivo')}
              placeholder="Ingrese el motivo de la anulación..."
              rows={3}
              className="text-sm"
              aria-invalid={!!form.formState.errors.motivo}
            />
          </FormFieldWrapper>

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
              {result.status === 'OK' ? (
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Anulación Exitosa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">ID Transacción</label>
                        <p className="text-sm font-mono font-medium">{result.idTransaccion}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mensaje</label>
                        <p className="text-sm">{result.mensaje}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">Anulación no exitosa</p>
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
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Anulando...
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Anular
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


