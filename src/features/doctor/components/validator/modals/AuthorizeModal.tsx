'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared';
import { Loader2, AlertCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { authorizeSchema, type AuthorizeFormData } from '../schemas/authorize.schema';
import { SocioNumberInput } from '../components/SocioNumberInput';
import { useAuthorize } from '../hooks/useAuthorize';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';

interface AuthorizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

// Códigos de prestación disponibles (por ahora solo consulta)
const prestacionCodes = [
  { value: '420101', label: 'Consulta' },
];

export function AuthorizeModal({ 
  isOpen, 
  onClose,
  onSuccess 
}: AuthorizeModalProps) {
  const form = useForm<AuthorizeFormData>({
    resolver: zodResolver(authorizeSchema),
    defaultValues: {
      codigoSocio: '',
      token: '',
      codigoPrestacion: '420101', // Valor por defecto
    },
  });

  const { 
    authorize, 
    isLoading, 
    error, 
    result,
    clearError,
    clearResult 
  } = useAuthorize();

  const handleClose = () => {
    form.reset({
      codigoSocio: '',
      token: '',
      codigoPrestacion: '420101',
    });
    clearError();
    clearResult();
    onClose();
  };

  const onSubmit = async (data: AuthorizeFormData) => {
    clearError();
    clearResult();
    
    try {
      const response = await authorize({
        codigoSocio: data.codigoSocio,
        token: data.token || '',
        codigoPrestacion: data.codigoPrestacion,
      });
      
      if (response && onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      // El error ya se maneja en el hook
      console.error('Error al autorizar:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Autorizar Consulta</DialogTitle>
          <DialogDescription>
            Complete los datos para autorizar una consulta en Avalian
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="pr-2">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Número de Socio */}
          <SocioNumberInput
            value={form.watch('codigoSocio') || ''}
            onChange={(value) => form.setValue('codigoSocio', value, { shouldValidate: true })}
            error={form.formState.errors.codigoSocio?.message}
            required
          />

          {/* Token (opcional) */}
          <FormFieldWrapper 
            label="Token (opcional)" 
            error={form.formState.errors.token?.message}
          >
            <Input
              type="text"
              value={form.watch('token') || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                form.setValue('token', value, { shouldValidate: true });
              }}
              placeholder="000"
              maxLength={3}
              className="text-sm font-mono"
              aria-invalid={!!form.formState.errors.token}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Si el código de socio incluye token, ingrésalo aquí (3 dígitos)
            </p>
          </FormFieldWrapper>

          {/* Código de Prestación */}
          <FormFieldWrapper 
            label="Código de Prestación" 
            error={form.formState.errors.codigoPrestacion?.message}
            required
          >
            <Select
              value={form.watch('codigoPrestacion') || '420101'}
              onValueChange={(value) => form.setValue('codigoPrestacion', value, { shouldValidate: true })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Seleccione un código" />
              </SelectTrigger>
              <SelectContent>
                {prestacionCodes.map((prestacion) => (
                  <SelectItem key={prestacion.value} value={prestacion.value}>
                    {prestacion.label} ({prestacion.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <Card className="border-border bg-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Autorización Exitosa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {result.idAutorizacion && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">ID Autorización</label>
                          <p className="text-sm font-mono font-medium">{result.idAutorizacion}</p>
                        </div>
                      )}
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
                      <p className="font-semibold">Autorización no exitosa</p>
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
            {result && result.status === 'OK' ? (
              // Si la operación fue exitosa, solo mostrar botón de cerrar
              <Button
                type="button"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            ) : (
              // Si hay error o aún no hay resultado, mostrar Cancelar y Autorizar
              <>
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
                      Autorizando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Autorizar
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
