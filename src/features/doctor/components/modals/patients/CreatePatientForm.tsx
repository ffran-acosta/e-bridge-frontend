"use client";

import { UseFormReturn } from 'react-hook-form';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';
import { CreatePatientFormSchema } from '../../lib/patient-form.schema';
import { SelectOption, Insurance } from '../../types/patient-form.types';
import { Plus, X, AlertCircle } from 'lucide-react';
import { Alert } from '@/shared/components/ui/alert';

interface CreatePatientFormProps {
  form: UseFormReturn<CreatePatientFormSchema>;
  handleSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  insurances: Insurance[];
  insurancesLoading: boolean;
  insurancesError: string | null;
  genderOptions: SelectOption[];
  patientTypeOptions: SelectOption[];
  defaultType: 'NORMAL' | 'ART';
  onClose: () => void;
}

export function CreatePatientForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  insurances,
  insurancesLoading,
  insurancesError,
  genderOptions,
  patientTypeOptions,
  defaultType,
  onClose,
}: CreatePatientFormProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  // Observar el tipo de paciente para mostrar campos condicionales
  const patientType = watch('type');

  // Manejar arrays dinámicos
  const addArrayItem = (field: 'medicalHistory' | 'currentMedications' | 'allergies') => {
    const currentValues = form.getValues(field) || [];
    form.setValue(field, [...currentValues, '']);
  };

  const removeArrayItem = (field: 'medicalHistory' | 'currentMedications' | 'allergies', index: number) => {
    const currentValues = form.getValues(field) || [];
    form.setValue(field, currentValues.filter((_, i) => i !== index));
  };

  const updateArrayItem = (field: 'medicalHistory' | 'currentMedications' | 'allergies', index: number, value: string) => {
    const currentValues = form.getValues(field) || [];
    const newValues = [...currentValues];
    newValues[index] = value;
    form.setValue(field, newValues);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log('🔄 Formulario enviado, ejecutando handleSubmit...');
    console.log('🔍 Valores actuales del formulario:', form.getValues());
    console.log('🔍 Tipo actual en formulario:', form.getValues('type'));
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 pb-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {/* Sección: Datos Personales */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Datos Personales
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormFieldWrapper
            label="Nombre"
            error={errors.firstName?.message}
            required
          >
            <Input
              {...register('firstName')}
              placeholder="Ingrese el nombre"
              aria-invalid={!!errors.firstName}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Apellido"
            error={errors.lastName?.message}
            required
          >
            <Input
              {...register('lastName')}
              placeholder="Ingrese el apellido"
              aria-invalid={!!errors.lastName}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="DNI"
            error={errors.dni?.message}
            required
          >
            <Input
              {...register('dni')}
              placeholder="12345678"
              maxLength={8}
              aria-invalid={!!errors.dni}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Género"
            error={errors.gender?.message}
            required
          >
            <Select
              value={watch('gender')}
              onValueChange={(value) => setValue('gender', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione género" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Fecha de Nacimiento"
            error={errors.birthdate?.message}
            required
          >
            <Input
              type="date"
              {...register('birthdate')}
              aria-invalid={!!errors.birthdate}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Tipo de Paciente"
            error={errors.type?.message}
            required
          >
            <Select
              value={watch('type')}
              onValueChange={(value) => setValue('type', value as any)}
              disabled={defaultType !== 'NORMAL'} // Si viene predeterminado como ART, no se puede cambiar
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                {patientTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
      </div>

      {/* Sección: Obra Social */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Obra Social
        </h3>
        
        <FormFieldWrapper
          label="Obra Social"
          error={errors.insuranceId?.message}
          required
        >
          <Select
            value={watch('insuranceId')}
            onValueChange={(value) => setValue('insuranceId', value)}
            disabled={insurancesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={insurancesLoading ? "Cargando..." : "Seleccione obra social"} />
            </SelectTrigger>
            <SelectContent>
              {insurances.map((insurance) => (
                <SelectItem key={insurance.id} value={insurance.id}>
                  {insurance.name} - {insurance.planName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {insurancesError && (
            <p className="text-sm text-destructive mt-1">{insurancesError}</p>
          )}
        </FormFieldWrapper>
      </div>

      {/* Sección: Dirección */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Dirección
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormFieldWrapper
            label="Calle"
            error={errors.street?.message}
          >
            <Input
              {...register('street')}
              placeholder="Nombre de la calle"
              aria-invalid={!!errors.street}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Número"
            error={errors.streetNumber?.message}
          >
            <Input
              {...register('streetNumber')}
              placeholder="1234"
              aria-invalid={!!errors.streetNumber}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Piso"
            error={errors.floor?.message}
          >
            <Input
              {...register('floor')}
              placeholder="2"
              aria-invalid={!!errors.floor}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Departamento"
            error={errors.apartment?.message}
          >
            <Input
              {...register('apartment')}
              placeholder="A"
              aria-invalid={!!errors.apartment}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Ciudad"
            error={errors.city?.message}
          >
            <Input
              {...register('city')}
              placeholder="Buenos Aires"
              aria-invalid={!!errors.city}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Provincia"
            error={errors.province?.message}
          >
            <Input
              {...register('province')}
              placeholder="CABA"
              aria-invalid={!!errors.province}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Código Postal"
            error={errors.postalCode?.message}
          >
            <Input
              {...register('postalCode')}
              placeholder="1043"
              maxLength={8}
              aria-invalid={!!errors.postalCode}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* Sección: Contacto */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Contacto
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormFieldWrapper
            label="Teléfono Principal"
            error={errors.phone1?.message}
          >
            <Input
              {...register('phone1')}
              placeholder="+54911234567"
              aria-invalid={!!errors.phone1}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Teléfono Secundario"
            error={errors.phone2?.message}
          >
            <Input
              {...register('phone2')}
              placeholder="+54911234568"
              aria-invalid={!!errors.phone2}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Email"
            error={errors.email?.message}
            className="md:col-span-2"
          >
            <Input
              type="email"
              {...register('email')}
              placeholder="juan.perez@email.com"
              aria-invalid={!!errors.email}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* Sección: Contacto de Emergencia */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Contacto de Emergencia
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormFieldWrapper
            label="Nombre"
            error={errors.emergencyContactName?.message}
          >
            <Input
              {...register('emergencyContactName')}
              placeholder="María Pérez"
              aria-invalid={!!errors.emergencyContactName}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Teléfono"
            error={errors.emergencyContactPhone?.message}
          >
            <Input
              {...register('emergencyContactPhone')}
              placeholder="+54911234569"
              aria-invalid={!!errors.emergencyContactPhone}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Relación"
            error={errors.emergencyContactRelation?.message}
          >
            <Input
              {...register('emergencyContactRelation')}
              placeholder="Esposa"
              aria-invalid={!!errors.emergencyContactRelation}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* Sección: Historia Médica */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground border-b pb-2">
          Historia Médica
        </h3>
        
        <div className="space-y-3">
          {/* Historial Médico */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Historial Médico</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('medicalHistory')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            {watch('medicalHistory')?.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={item}
                  onChange={(e) => updateArrayItem('medicalHistory', index, e.target.value)}
                  placeholder="Ej: Hipertensión"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('medicalHistory', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Medicamentos Actuales */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Medicamentos Actuales</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('currentMedications')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            {watch('currentMedications')?.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={item}
                  onChange={(e) => updateArrayItem('currentMedications', index, e.target.value)}
                  placeholder="Ej: Losartán 50mg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('currentMedications', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Alergias */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Alergias</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('allergies')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            {watch('allergies')?.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={item}
                  onChange={(e) => updateArrayItem('allergies', index, e.target.value)}
                  placeholder="Ej: Penicilina"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('allergies', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
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
          {isSubmitting ? 'Creando...' : 'Crear Paciente'}
        </Button>
      </div>
    </form>
  );
}
