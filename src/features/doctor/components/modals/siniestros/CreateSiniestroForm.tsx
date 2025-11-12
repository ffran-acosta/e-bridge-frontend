"use client";

import type { BaseSyntheticEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';
import { CreateSiniestroFormSchema } from '../../../lib/siniestro-form.schema';
import { SelectOption, ART, MedicalEstablishment, Employer, ContingencyType } from '../../../types/siniestro-form.types';
import { AlertCircle } from 'lucide-react';
import { Alert } from '@/shared/components/ui/alert';

interface CreateSiniestroFormProps {
  form: UseFormReturn<CreateSiniestroFormSchema>;
  handleSubmit: (event?: BaseSyntheticEvent) => void;
  isSubmitting: boolean;
  error: string | null;
  arts: ART[];
  artsLoading: boolean;
  artsError: string | null;
  establishments: MedicalEstablishment[];
  establishmentsLoading: boolean;
  establishmentsError: string | null;
  employers: Employer[];
  employersLoading: boolean;
  employersError: string | null;
  contingencyTypeOptions: SelectOption[];
  patientName: string;
  onClose: () => void;
}

export function CreateSiniestroForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  arts,
  artsLoading,
  artsError,
  establishments,
  establishmentsLoading,
  establishmentsError,
  employers,
  employersLoading,
  employersError,
  contingencyTypeOptions,
  patientName,
  onClose,
}: CreateSiniestroFormProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {/* Información del Paciente */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Información del Paciente
        </h3>
        
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Paciente: {patientName}</p>
          <p className="text-xs text-muted-foreground">Tipo: ART</p>
        </div>
      </div>

      {/* Datos del Siniestro */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Datos del Siniestro
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormFieldWrapper
            label="Tipo de Contingencia"
            error={errors.contingencyType?.message}
            required
          >
            <Select
              value={watch('contingencyType')}
              onValueChange={(value) =>
                setValue('contingencyType', value as ContingencyType, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de contingencia" />
              </SelectTrigger>
              <SelectContent>
                {contingencyTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Fecha y Hora del Accidente"
            error={errors.accidentDateTime?.message}
            required
          >
            <Input
              type="datetime-local"
              {...register('accidentDateTime')}
              aria-invalid={!!errors.accidentDateTime}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* Catálogos */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Información Institucional
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormFieldWrapper
            label="ART (Aseguradora)"
            error={errors.artId?.message}
            required
          >
            <Select
              value={watch('artId')}
              onValueChange={(value) => setValue('artId', value)}
              disabled={artsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={artsLoading ? "Cargando..." : "Seleccione ART"} />
              </SelectTrigger>
              <SelectContent>
                {arts.map((art) => (
                  <SelectItem key={art.id} value={art.id}>
                    {art.name} {art.code && `(${art.code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {artsError && (
              <p className="text-sm text-destructive mt-1">{artsError}</p>
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Establecimiento Médico"
            error={errors.medicalEstablishmentId?.message}
            required
          >
            <Select
              value={watch('medicalEstablishmentId')}
              onValueChange={(value) => setValue('medicalEstablishmentId', value)}
              disabled={establishmentsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={establishmentsLoading ? "Cargando..." : "Seleccione establecimiento"} />
              </SelectTrigger>
              <SelectContent>
                {establishments.map((establishment) => (
                  <SelectItem key={establishment.id} value={establishment.id}>
                    {establishment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {establishmentsError && (
              <p className="text-sm text-destructive mt-1">{establishmentsError}</p>
            )}
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Empleador"
            error={errors.employerId?.message}
            required
            className="md:col-span-2"
          >
            <Select
              value={watch('employerId')}
              onValueChange={(value) => setValue('employerId', value)}
              disabled={employersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={employersLoading ? "Cargando..." : "Seleccione empleador"} />
              </SelectTrigger>
              <SelectContent>
                {employers.map((employer) => (
                  <SelectItem key={employer.id} value={employer.id}>
                    {employer.name} {employer.cuit && `(${employer.cuit})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {employersError && (
              <p className="text-sm text-destructive mt-1">{employersError}</p>
            )}
          </FormFieldWrapper>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando...' : 'Crear Siniestro'}
        </Button>
      </div>
    </form>
  );
}
