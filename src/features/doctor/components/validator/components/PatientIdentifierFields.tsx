'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { EligibilityFormData } from '../schemas/eligibility.schema';
import { SocioNumberInput } from './SocioNumberInput';

interface PatientIdentifierFieldsProps {
  form: UseFormReturn<EligibilityFormData>;
}

/**
 * Componente reutilizable para campos de identificación del paciente
 * Se usa tanto en validación de estado como en autorización
 */
export function PatientIdentifierFields({ form }: PatientIdentifierFieldsProps) {
  const { watch, setValue, formState: { errors } } = form;
  const codigoSocio = watch('codigoSocio');

  return (
    <div className="space-y-4">
      <SocioNumberInput
        value={codigoSocio || ''}
        onChange={(value) => setValue('codigoSocio', value, { shouldValidate: true })}
        error={errors.codigoSocio?.message}
        required
      />
    </div>
  );
}
