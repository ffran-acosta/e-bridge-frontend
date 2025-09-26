"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared';
import { Calendar, Clock, User, Stethoscope, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from '../shared/FormField';
import { DateTimeInput } from '../shared/DateTimeInput';
import { 
  appointmentFormSchema, 
  type AppointmentFormData
} from '../../../lib/appointment-form.schema';

interface CreateAppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  patientId: string;
  doctorId: string;
  patientName: string;
}

export function CreateAppointmentForm({
  onSubmit,
  isLoading = false,
  error,
  patientId,
  doctorId,
  patientName,
}: CreateAppointmentFormProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId,
      doctorId,
      appointmentDate: new Date().toISOString().slice(0, 10), // Fecha actual
      appointmentTime: new Date().toTimeString().slice(0, 5), // Hora actual
    },
  });

  const handleFormSubmit = (data: AppointmentFormData) => {
    console.log('📋 Datos del formulario:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información del paciente */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <User className="h-5 w-5" />
          <span>Información del Paciente</span>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Paciente:</p>
          <p className="font-medium">{patientName}</p>
        </div>
      </div>

      {/* Información del turno */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Calendar className="h-5 w-5" />
          <span>Información del Turno</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="appointmentDate"
            label="Fecha del Turno"
            required
            render={({ field }) => (
              <DateTimeInput
                {...field}
                type="date"
                className={cn(
                  "w-full",
                  errors.appointmentDate && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              />
            )}
          />

          <FormField
            control={control}
            name="appointmentTime"
            label="Hora del Turno"
            required
            render={({ field }) => (
              <DateTimeInput
                {...field}
                type="time"
                className={cn(
                  "w-full",
                  errors.appointmentTime && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              />
            )}
          />
        </div>

      </div>

      {/* Notas adicionales */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <FileText className="h-5 w-5" />
          <span>Información Adicional</span>
        </div>

        <FormField
          control={control}
          name="notes"
          label="Notas del Turno"
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Notas adicionales sobre el turno..."
              className={cn(
                "min-h-[80px]",
                errors.notes && "border-red-500"
              )}
              disabled={isSubmitting || isLoading}
            />
          )}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || isLoading}
          size="lg"
          className="px-8"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          size="lg"
          className="bg-primary hover:bg-primary/90 px-8"
        >
          {isSubmitting ? 'Creando Turno...' : 'Crear Turno'}
        </Button>
      </div>
    </form>
  );
}
