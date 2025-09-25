"use client";

import { UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { FormField } from '../shared/FormField';
import { FormWrapper } from '@/shared/components/forms/FormWrapper';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { AlertTriangle, Building, User } from 'lucide-react';
import { DateTimeInput } from '../shared/DateTimeInput';
import { cn } from '@/lib/utils';
import { IngresoConsultationFormData } from '../../lib/ingreso-consultation-form.schema';

interface IngresoConsultationFormProps {
  form: UseFormReturn<IngresoConsultationFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  patientName: string;
  medicalEstablishments: Array<{
    id: string;
    name: string;
  }>;
  onClose: () => void;
}

export function IngresoConsultationForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  patientName,
  medicalEstablishments,
  onClose,
}: IngresoConsultationFormProps) {
  const { control, watch, setValue } = form;
  
  // Observar cambios en fechas para calcular automáticamente otras fechas
  const accidentDateTime = watch('artDetails.accidentDateTime');
  const workAbsenceStartDateTime = watch('artDetails.workAbsenceStartDateTime');

  // Función para establecer fecha automáticamente
  const setAutomaticDate = (field: string, hoursToAdd: number = 0) => {
    if (accidentDateTime) {
      const accidentDate = new Date(accidentDateTime);
      accidentDate.setHours(accidentDate.getHours() + hoursToAdd);
      setValue(field as any, accidentDate.toISOString());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <AlertTriangle className="h-8 w-8 text-orange-500" />
          Consulta de Ingreso ART
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
                placeholder="Describir el motivo de la consulta..."
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
                placeholder="Diagnóstico médico..."
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
                placeholder="Tratamiento e indicaciones médicas..."
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
                <DateTimeInput
                  {...field}
                  type="datetime-local"
                />
              )}
            />

            <FormField
              control={control}
              name="nextAppointmentDate"
              label="Próxima Cita (Opcional)"
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  type="datetime-local"
                />
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
            Detalles del Accidente Laboral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="artDetails.accidentDateTime"
              label="Fecha y Hora del Accidente"
              required
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  type="datetime-local"
                  onChange={(e) => {
                    field.onChange(e);
                    // Establecer automáticamente otras fechas
                    setAutomaticDate('artDetails.workAbsenceStartDateTime', 0);
                    setAutomaticDate('artDetails.firstMedicalAttentionDateTime', 0);
                  }}
                />
              )}
            />

            <FormField
              control={control}
              name="artDetails.workAbsenceStartDateTime"
              label="Inicio de Ausencia Laboral"
              required
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  type="datetime-local"
                />
              )}
            />
          </div>

          <FormField
            control={control}
            name="artDetails.firstMedicalAttentionDateTime"
            label="Primera Atención Médica"
            required
            render={({ field }) => (
              <DateTimeInput
                {...field}
                type="datetime-local"
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="artDetails.probableDischargeDate"
              label="Fecha Probable de Alta"
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  type="date"
                />
              )}
            />

            <FormField
              control={control}
              name="artDetails.nextRevisionDate"
              label="Próxima Revisión"
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  type="date"
                />
              )}
            />

            <div className="flex items-center justify-center">
              <FormField
                control={control}
                name="artDetails.workSickLeave"
                label="Licencia médica laboral"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="workSickLeave"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="workSickLeave" className="text-sm font-medium">
                      Licencia médica laboral
                    </label>
                  </div>
                )}
              />
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Información del establecimiento del accidente */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Building className="h-6 w-6 text-green-500" />
            Establecimiento del Accidente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="artDetails.accidentEstablishmentName"
            label="Nombre del Establecimiento"
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nombre de la empresa o establecimiento"
                className="text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <FormField
            control={control}
            name="artDetails.accidentEstablishmentAddress"
            label="Dirección"
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Dirección completa del establecimiento"
                className="text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <FormField
            control={control}
            name="artDetails.accidentEstablishmentPhone"
            label="Teléfono"
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Teléfono del establecimiento"
                className="text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Contacto del establecimiento */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <User className="h-6 w-6 text-purple-500" />
            Contacto del Establecimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="artDetails.accidentContactName"
            label="Nombre del Contacto"
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nombre de la persona de contacto"
                className="text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="artDetails.accidentContactCellphone"
              label="Celular"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Número de celular"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="artDetails.accidentContactEmail"
              label="Email (Opcional)"
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Email de contacto"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>
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
          {isSubmitting ? 'Creando Consulta...' : 'Crear Consulta de Ingreso'}
        </Button>
      </div>
    </form>
  );
}
