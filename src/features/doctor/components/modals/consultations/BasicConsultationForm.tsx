"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { FormField } from '../shared/FormField';
import { DateTimeInput } from '../shared/DateTimeInput';
import { basicConsultationFormSchema, getBasicConsultationDefaultValues, consultationTypes, type BasicConsultationFormData } from '../../../lib/basic-consultation-form.schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cn } from '@/lib/utils';
import { Stethoscope, Calendar, Clock, FileText, Pill, AlertCircle } from 'lucide-react';

interface BasicConsultationFormProps {
  onSubmit: (data: BasicConsultationFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  medicalEstablishments?: Array<{
    id: string;
    name: string;
    address?: string;
  }>;
}

export function BasicConsultationForm({
  onSubmit,
  isLoading = false,
  error,
  medicalEstablishments = [],
}: BasicConsultationFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicConsultationFormData>({
    resolver: zodResolver(basicConsultationFormSchema),
    defaultValues: getBasicConsultationDefaultValues(),
  });

  const handleFormSubmit = (data: BasicConsultationFormData) => {
    console.log('📋 Datos del formulario:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información básica de la consulta */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Stethoscope className="h-5 w-5" />
          <span>Información de la Consulta</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="type"
            label="Tipo de Consulta"
            required
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting || isLoading}
              >
                <SelectTrigger className={cn(
                  "w-full",
                  errors.type && "border-red-500"
                )}>
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {consultationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={control}
            name="medicalAssistanceDate"
            label="Fecha de Atención"
            render={({ field }) => (
              <DateTimeInput
                {...field}
                type="datetime-local"
                className={cn(
                  "w-full",
                  errors.medicalAssistanceDate && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              />
            )}
          />
        </div>

        <FormField
          control={control}
          name="medicalEstablishmentId"
          label="Establecimiento Médico"
          required
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting || isLoading}
            >
              <SelectTrigger className={cn(
                "w-full",
                errors.medicalEstablishmentId && "border-red-500"
              )}>
                <SelectValue placeholder="Seleccionar establecimiento..." />
              </SelectTrigger>
              <SelectContent>
                {medicalEstablishments.map((establishment) => (
                  <SelectItem key={establishment.id} value={establishment.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{establishment.name}</span>
                      {establishment.address && (
                        <span className="text-xs text-muted-foreground">
                          {establishment.address}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FormField
          control={control}
          name="consultationReason"
          label="Motivo de Consulta"
          required
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Describa el motivo principal de la consulta..."
              className={cn(
                "min-h-[80px]",
                errors.consultationReason && "border-red-500"
              )}
              disabled={isSubmitting || isLoading}
            />
          )}
        />
      </div>

      {/* Diagnóstico y tratamiento */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <FileText className="h-5 w-5" />
          <span>Diagnóstico y Tratamiento</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={control}
            name="diagnosis"
            label="Diagnóstico"
            required
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Diagnóstico médico..."
                className={cn(
                  "min-h-[80px]",
                  errors.diagnosis && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              />
            )}
          />

          <FormField
            control={control}
            name="medicalIndications"
            label="Indicaciones Médicas"
            required
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Indicaciones médicas para el paciente..."
                className={cn(
                  "min-h-[80px]",
                  errors.medicalIndications && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              />
            )}
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Calendar className="h-5 w-5" />
          <span>Información Adicional</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="nextAppointmentDate"
            label="Fecha de Próxima Cita"
            render={({ field }) => (
              <DateTimeInput
                {...field}
                type="datetime-local"
                className={cn(
                  "w-full",
                  errors.nextAppointmentDate && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              />
            )}
          />

          <FormField
            control={control}
            name="medicalAssistancePlace"
            label="Lugar de Atención"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ej: Consultorio 1, Sala de espera..."
                className={cn(
                  "w-full",
                  errors.medicalAssistancePlace && "border-red-500"
                )}
                disabled={isSubmitting || isLoading}
              />
            )}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Botón de envío */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex items-center gap-2"
        >
          {isSubmitting || isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creando Consulta...
            </>
          ) : (
            <>
              <Stethoscope className="h-4 w-4" />
              Crear Consulta Básica
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
