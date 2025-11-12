"use client";

import type { ReactNode } from 'react';
import { Control, FieldPath, FieldValues, useController, ControllerRenderProps, ControllerFieldState } from 'react-hook-form';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  required?: boolean;
  render: (params: { field: ControllerRenderProps<TFieldValues, TName>; fieldState: ControllerFieldState }) => ReactNode;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label = "",
  required,
  render,
}: FormFieldProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({
    control,
    name,
  });

  return (
    <FormFieldWrapper 
      label={label} 
      required={required} 
      error={fieldState.error?.message}
      className="space-y-2"
    >
      {render({ field, fieldState })}
    </FormFieldWrapper>
  );
}
