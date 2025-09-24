"use client";

import { UseFormReturn } from 'react-hook-form';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';
import { EditPatientFormSchema } from '../../lib/edit-patient-form.schema';
import { Plus, X, AlertCircle } from 'lucide-react';
import { Alert } from '@/shared/components/ui/alert';

// Opciones para los selects
const GENDER_OPTIONS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'NO_BINARIO', label: 'No binario' }
];

const PATIENT_TYPE_OPTIONS = [
  { value: 'NORMAL', label: 'Normal (Obra Social)' },
  { value: 'ART', label: 'ART (Aseguradora de Riesgos del Trabajo)' }
];

const STATUS_OPTIONS = [
  { value: 'INGRESO', label: 'Ingreso' },
  { value: 'ATENCION', label: 'Atención' },
  { value: 'CIRUGIA', label: 'Cirugía' },
  { value: 'ALTA_MEDICA', label: 'Alta Médica' }
];

interface EditPatientFormProps {
  form: UseFormReturn<EditPatientFormSchema>;
  handleSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
}

export function EditPatientForm({
  form,
  handleSubmit,
  isSubmitting,
  error,
  onClose,
}: EditPatientFormProps) {
  const { register, watch, setValue, formState: { errors } } = form;

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
    console.log('🔄 Formulario de edición enviado, ejecutando handleSubmit...');
    console.log('🔍 Valores actuales del formulario:', form.getValues());
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
                {GENDER_OPTIONS.map((option) => (
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                {PATIENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Estado Actual"
            error={errors.currentStatus?.message}
            required
          >
            <Select
              value={watch('currentStatus')}
              onValueChange={(value) => setValue('currentStatus', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
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
            label="Ciudad"
            error={errors.city?.message}
          >
            <Input
              {...register('city')}
              placeholder="Buenos Aires"
              aria-invalid={!!errors.city}
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
            label="Email"
            error={errors.email?.message}
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
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
