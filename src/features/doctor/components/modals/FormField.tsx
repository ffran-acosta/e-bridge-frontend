"use client";

import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  required?: boolean;
  render: ({ field, fieldState }: { field: any; fieldState: any }) => React.ReactNode;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, name, label, required, render }: FormFieldProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({
    control,
    name,
  });

  return (
    <FormFieldWrapper 
      label={label} 
      required={required} 
      error={fieldState.error?.message}
    >
      {render({ field, fieldState })}
    </FormFieldWrapper>
  );
}
