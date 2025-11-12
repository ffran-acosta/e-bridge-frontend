"use client";

import type { BaseSyntheticEvent } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { FormField } from '../shared/FormField';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Stethoscope, Building } from 'lucide-react';
import { DateTimeInput } from '../shared/DateTimeInput';
import { AtencionConsultationFormData } from '../../../lib/atencion-consultation-form.schema';
import type { PatientProfile } from '@/shared/types/patients.types';

interface AtencionConsultationFormProps {
  form: UseFormReturn<AtencionConsultationFormData>;
  handleSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  patientName: string;
  medicalEstablishments: Array<{
    id: string;
    name: string;
  }>;
  siniestroData?: PatientProfile['siniestro'];
  onClose: () => void;
}

export function AtencionConsultationForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  patientName,
  medicalEstablishments,
  siniestroData,
  onClose,
}: AtencionConsultationFormProps) {
  const { control } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Stethoscope className="h-8 w-8 text-green-500" />
          Consulta de Atención ART
        </h2>
        <p className="text-lg text-muted-foreground">
          Paciente: <span className="font-semibold text-foreground">{patientName}</span>
        </p>
      </div>

      {/* Error general */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Información básica de la consulta */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Información de la Consulta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="medicalEstablishmentId"
            label="Establecimiento Médico"
            required
            render={({ field }) => (
              <div className="space-y-2">
                <select
                  {...field}
                  className="w-full p-3 h-12 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  style={{ paddingTop: '12px', paddingBottom: '12px' }}
                >
                  <option value="">Seleccionar establecimiento...</option>
                  {medicalEstablishments.map((establishment) => (
                    <option key={establishment.id} value={establishment.id}>
                      {establishment.name}
                    </option>
                  ))}
                </select>
                {siniestroData?.medicalEstablishment && (
                  <p className="text-xs text-muted-foreground">
                    💡 Preseleccionado del siniestro: <span className="font-medium">{siniestroData.medicalEstablishment.name}</span>
                  </p>
                )}
              </div>
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
                placeholder="Describir el motivo de la consulta de seguimiento..."
                className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <FormField
            control={control}
            name="diagnosis"
            label="Diagnóstico"
            required
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Diagnóstico actualizado..."
                className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
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
                placeholder="Nuevas indicaciones y tratamiento..."
                className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="medicalAssistancePlace"
              label="Lugar de Asistencia Médica"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ej: Consultorio de Traumatología"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="medicalAssistanceDate"
              label="Fecha de Asistencia Médica"
              required
              render={({ field }) => (
                <div className="space-y-2">
                  <DateTimeInput
                    {...field}
                    type="datetime-local"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Preseleccionada con fecha y hora actual
                  </p>
                </div>
              )}
            />

            <FormField
              control={control}
              name="nextAppointmentDate"
              label="Próxima Cita (Opcional)"
              render={({ field }) => (
                <div className="space-y-2">
                  <DateTimeInput
                    {...field}
                    type="datetime-local"
                  />
                  <p className="text-xs text-muted-foreground">
                    📅 Campo opcional - puede dejarse vacío
                  </p>
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detalles específicos ART */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Building className="h-6 w-6 text-blue-500" />
            Detalles del Seguimiento ART
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="artDetails.nextRevisionDateTime"
            label="Próxima Revisión (Opcional)"
            render={({ field }) => (
              <div className="space-y-2">
                <DateTimeInput
                  {...field}
                  type="datetime-local"
                />
                <p className="text-xs text-muted-foreground">
                  🔄 Campo opcional - puede dejarse vacío
                </p>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          size="lg"
          className="px-8"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="bg-primary hover:bg-primary/90 px-8"
        >
          {isSubmitting ? 'Creando Consulta...' : 'Crear Consulta de Atención'}
        </Button>
      </div>
    </form>
  );
}
