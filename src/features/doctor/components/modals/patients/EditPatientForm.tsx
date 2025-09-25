"use client";

import { UseFormReturn } from 'react-hook-form';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { FormField } from '../shared/FormField';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { User, MapPin, Phone, Mail, Heart, Pill, AlertTriangle } from 'lucide-react';
import { DateTimeInput } from '../shared/DateTimeInput';
import { cn } from '@/lib/utils';
import { EditPatientFormData, GENDERS, PATIENT_TYPES, CURRENT_STATUS_OPTIONS } from '../../../lib/edit-patient-form.schema';

interface EditPatientFormProps {
  form: UseFormReturn<EditPatientFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  patientName: string;
  insurances: Array<{
    id: string;
    name: string;
  }>;
  onClose: () => void;
}

export function EditPatientForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  patientName,
  insurances,
  onClose,
}: EditPatientFormProps) {
  const { control, watch } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
          <User className="h-8 w-8 text-blue-500" />
          Editar Paciente
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

      {/* Información personal */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="firstName"
              label="Nombre"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nombre del paciente"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="lastName"
              label="Apellido"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Apellido del paciente"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="dni"
              label="DNI"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="12345678"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="gender"
              label="Género"
              required
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 h-12 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  style={{ paddingTop: '12px', paddingBottom: '12px' }}
                >
                  {GENDERS.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              )}
            />

            <FormField
              control={control}
              name="birthdate"
              label="Fecha de Nacimiento"
              required
              render={({ field }) => (
                <DateTimeInput
                  {...field}
                  type="date"
                />
              )}
            />

            <FormField
              control={control}
              name="insuranceId"
              label="Obra Social"
              required
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 h-12 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  style={{ paddingTop: '12px', paddingBottom: '12px' }}
                >
                  <option value="">Seleccionar obra social...</option>
                  {insurances.map((insurance) => (
                    <option key={insurance.id} value={insurance.id}>
                      {insurance.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="type"
              label="Tipo de Paciente"
              required
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 h-12 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  style={{ paddingTop: '12px', paddingBottom: '12px' }}
                >
                  {PATIENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}
            />

            <FormField
              control={control}
              name="currentStatus"
              label="Estado Actual"
              required
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 h-12 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  style={{ paddingTop: '12px', paddingBottom: '12px' }}
                >
                  {CURRENT_STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Información de contacto */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Phone className="h-6 w-6 text-green-500" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="phone1"
              label="Teléfono Principal"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="11-1234-5678"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="phone2"
              label="Teléfono Secundario"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="11-9876-5432"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>

          <FormField
            control={control}
            name="email"
            label="Email"
            render={({ field }) => (
              <div className="space-y-2">
                <Input
                  {...field}
                  type="email"
                  placeholder="juan.perez@email.com"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  📧 Campo opcional
                </p>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Dirección */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <MapPin className="h-6 w-6 text-orange-500" />
            Dirección
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              control={control}
              name="street"
              label="Calle"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Av. Corrientes"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="streetNumber"
              label="Número"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="1234"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="floor"
              label="Piso"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="5"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="apartment"
              label="Departamento"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="A"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="city"
              label="Ciudad"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Buenos Aires"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="province"
              label="Provincia"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="CABA"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="postalCode"
              label="Código Postal"
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="1043"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacto de emergencia */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Contacto de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="emergencyContactName"
              label="Nombre del Contacto"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="María Pérez"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="emergencyContactPhone"
              label="Teléfono del Contacto"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="11-5555-1234"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />

            <FormField
              control={control}
              name="emergencyContactRelation"
              label="Relación"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Esposa"
                  className="text-sm h-12 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Información médica */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Heart className="h-6 w-6 text-purple-500" />
            Información Médica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="medicalHistory"
            label="Historial Médico"
            render={({ field }) => (
              <div className="space-y-2">
                <Textarea
                  {...field}
                  value={field.value.join('\n')}
                  onChange={(e) => field.onChange(e.target.value.split('\n').filter(item => item.trim() !== ''))}
                  placeholder="Hipertensión arterial&#10;Diabetes tipo 2&#10;Alergia a la penicilina"
                  className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Una condición por línea
                </p>
              </div>
            )}
          />

          <FormField
            control={control}
            name="currentMedications"
            label="Medicamentos Actuales"
            render={({ field }) => (
              <div className="space-y-2">
                <Textarea
                  {...field}
                  value={field.value.join('\n')}
                  onChange={(e) => field.onChange(e.target.value.split('\n').filter(item => item.trim() !== ''))}
                  placeholder="Metformina 500mg&#10;Losartán 50mg&#10;Aspirina 100mg"
                  className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  💊 Un medicamento por línea
                </p>
              </div>
            )}
          />

          <FormField
            control={control}
            name="allergies"
            label="Alergias"
            render={({ field }) => (
              <div className="space-y-2">
                <Textarea
                  {...field}
                  value={field.value.join('\n')}
                  onChange={(e) => field.onChange(e.target.value.split('\n').filter(item => item.trim() !== ''))}
                  placeholder="Penicilina&#10;Polen&#10;Mariscos"
                  className="min-h-[100px] text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Una alergia por línea
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}