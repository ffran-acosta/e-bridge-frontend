"use client";

import type { BaseSyntheticEvent } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { FormField } from '../shared/FormField';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { DateTimeInput } from '../shared/DateTimeInput';
import { AltaConsultationFormData, DISCHARGE_REASONS } from '../../../lib/alta-consultation-form.schema';
import type { PatientProfile } from '@/shared/types/patients.types';

interface AltaConsultationFormProps {
  form: UseFormReturn<AltaConsultationFormData>;
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

export function AltaConsultationForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  patientName,
  medicalEstablishments,
  siniestroData,
  onClose,
}: AltaConsultationFormProps) {
  const { control } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          Consulta de Alta Médica ART
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
                placeholder="Describir el motivo de la consulta de alta..."
                className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <FormField
            control={control}
            name="diagnosis"
            label="Diagnóstico Final"
            required
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Diagnóstico final del caso..."
                className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <FormField
            control={control}
            name="medicalIndications"
            label="Indicaciones Médicas Finales"
            required
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Indicaciones finales y recomendaciones..."
                className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </CardContent>
      </Card>

      {/* Detalles específicos ART - Tratamiento */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-500" />
            Detalles del Tratamiento ART
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="artDetails.treatmentEndDateTime"
              label="Fecha de Fin de Tratamiento"
              render={({ field }) => (
                <div className="space-y-2">
                  <DateTimeInput
                    {...field}
                    type="datetime-local"
                  />
                  <p className="text-xs text-muted-foreground">
                    📅 Campo opcional
                  </p>
                </div>
              )}
            />

            <FormField
              control={control}
              name="artDetails.finalTreatmentEndDateTime"
              label="Fecha Final de Tratamiento"
              render={({ field }) => (
                <div className="space-y-2">
                  <DateTimeInput
                    {...field}
                    type="datetime-local"
                  />
                  <p className="text-xs text-muted-foreground">
                    📅 Campo opcional
                  </p>
                </div>
              )}
            />
          </div>

          <FormField
            control={control}
            name="artDetails.itlCeaseReason"
            label="Motivo de Alta ITL"
            required
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-3 h-12 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
              >
                {DISCHARGE_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            )}
          />

          <FormField
            control={control}
            name="artDetails.derivationReason"
            label="Motivo de Derivación"
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Describir motivo de derivación..."
                className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Detalles específicos ART - Estado del Paciente */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            Estado del Paciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Tratamiento Pendiente</h4>
              <FormField
                control={control}
                name="artDetails.pendingMedicalTreatment"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pendingMedicalTreatment"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="pendingMedicalTreatment" className="text-sm font-medium">
                      Tratamiento médico pendiente
                    </label>
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Recalificación Profesional</h4>
              <FormField
                control={control}
                name="artDetails.professionalRequalification"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="professionalRequalification"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="professionalRequalification" className="text-sm font-medium">
                      Requiere recalificación profesional
                    </label>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Afecciones</h4>
              <div className="space-y-3">
                <FormField
                  control={control}
                  name="artDetails.inculpableAffection"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inculpableAffection"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="inculpableAffection" className="text-sm">
                        Afección inculpable
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.disablingSequelae"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="disablingSequelae"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="disablingSequelae" className="text-sm">
                        Secuelas invalidantes
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.maintenanceBenefits"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="maintenanceBenefits"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="maintenanceBenefits" className="text-sm">
                        Beneficios de mantenimiento
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.psychologicalTreatment"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="psychologicalTreatment"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="psychologicalTreatment" className="text-sm">
                        Tratamiento psicológico
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.sequelaeEstimationRequired"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sequelaeEstimationRequired"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="sequelaeEstimationRequired" className="text-sm">
                        Requiere estimación de secuelas
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Estados Finales</h4>
              <div className="space-y-3">
                <FormField
                  control={control}
                  name="artDetails.finalDisablingSequelae"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="finalDisablingSequelae"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="finalDisablingSequelae" className="text-sm">
                        Secuelas invalidantes finales
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.finalProfessionalRequalification"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="finalProfessionalRequalification"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="finalProfessionalRequalification" className="text-sm">
                        Recalificación profesional final
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.finalMaintenanceBenefits"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="finalMaintenanceBenefits"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="finalMaintenanceBenefits" className="text-sm">
                        Beneficios de mantenimiento finales
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.finalPsychologicalTreatment"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="finalPsychologicalTreatment"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="finalPsychologicalTreatment" className="text-sm">
                        Tratamiento psicológico final
                      </label>
                    </div>
                  )}
                />
                <FormField
                  control={control}
                  name="artDetails.finalSequelaeEstimationRequired"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="finalSequelaeEstimationRequired"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="finalSequelaeEstimationRequired" className="text-sm">
                        Estimación de secuelas final requerida
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
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
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isSubmitting ? 'Creando Alta...' : 'Crear Alta Médica'}
        </Button>
      </div>
    </form>
  );
}
