"use client";

import { UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { FormField } from '../shared/FormField';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { RotateCcw, Building, Calendar, AlertCircle } from 'lucide-react';
import { DateTimeInput } from '../shared/DateTimeInput';
import { cn } from '@/lib/utils';
import { ReingresoConsultationFormData, READMISSION_ACCEPTED_OPTIONS, READMISSION_DENIAL_REASONS } from '../../../lib/reingreso-consultation-form.schema';

interface ReingresoConsultationFormProps {
  form: UseFormReturn<ReingresoConsultationFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  patientName: string;
  medicalEstablishments: Array<{
    id: string;
    name: string;
  }>;
  siniestroData?: any;
  onClose: () => void;
}

export function ReingresoConsultationForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  patientName,
  medicalEstablishments,
  siniestroData,
  onClose,
}: ReingresoConsultationFormProps) {
  const { control, watch } = form;
  
  // Watch para campos condicionales
  const readmissionAccepted = watch('artDetails.readmissionAccepted');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <RotateCcw className="h-8 w-8 text-blue-500" />
          Consulta de Reingreso ART
        </h2>
        <p className="text-lg text-muted-foreground">
          Paciente: <span className="font-semibold text-foreground">{patientName}</span>
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            <strong>Reingreso:</strong> Paciente que fue dado de alta pero requiere atención nuevamente
          </p>
        </div>
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
                placeholder="Describir el motivo del reingreso (ej: reagudización, complicaciones)..."
                className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <FormField
            control={control}
            name="diagnosis"
            label="Diagnóstico del Reingreso"
            required
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Diagnóstico actualizado para el reingreso..."
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
                placeholder="Indicaciones y tratamiento para el reingreso..."
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

      {/* Detalles específicos ART - Fechas del Reingreso */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Calendar className="h-6 w-6 text-green-500" />
            Fechas del Reingreso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="artDetails.originalContingencyDate"
              label="Fecha de Contingencia Original"
              required
              render={({ field }) => (
                <div className="space-y-2">
                  <DateTimeInput
                    {...field}
                    type="datetime-local"
                  />
                  <p className="text-xs text-muted-foreground">
                    📅 Fecha del accidente original
                  </p>
                </div>
              )}
            />

            <FormField
              control={control}
              name="artDetails.previousDischargeDate"
              label="Fecha de Alta Anterior"
              required
              render={({ field }) => (
                <div className="space-y-2">
                  <DateTimeInput
                    {...field}
                    type="datetime-local"
                  />
                  <p className="text-xs text-muted-foreground">
                    📅 Fecha de la última alta médica
                  </p>
                </div>
              )}
            />

            <FormField
              control={control}
              name="artDetails.readmissionRequestDate"
              label="Fecha de Solicitud de Reingreso"
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
          </div>
        </CardContent>
      </Card>

      {/* Detalles específicos ART - Estado del Reingreso */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Building className="h-6 w-6 text-purple-500" />
            Estado del Reingreso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="artDetails.readmissionAccepted"
            label="Reingreso Aceptado"
            render={({ field }) => (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="readmissionAccepted"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label htmlFor="readmissionAccepted" className="text-sm font-medium">
                    El reingreso ha sido aceptado
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Marcar si el reingreso del paciente ha sido aprobado
                </p>
              </div>
            )}
          />

          {!readmissionAccepted && (
            <FormField
              control={control}
              name="artDetails.readmissionDenialReason"
              label="Motivo de Denegación"
              render={({ field }) => (
                <div className="space-y-2">
                  <select
                    {...field}
                    className="w-full p-3 h-12 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                    style={{ paddingTop: '12px', paddingBottom: '12px' }}
                  >
                    <option value="">Seleccionar motivo de denegación...</option>
                    {READMISSION_DENIAL_REASONS.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Solo se muestra si el reingreso fue denegado
                  </p>
                </div>
              )}
            />
          )}
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          {isSubmitting ? 'Creando Reingreso...' : 'Crear Reingreso'}
        </Button>
      </div>
    </form>
  );
}
