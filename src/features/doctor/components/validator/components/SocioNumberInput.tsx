'use client';

import React, { useMemo } from 'react';
import { Input } from '@/shared';
import { FormFieldWrapper } from '@/shared/components/forms/FormField';

interface SocioNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

/**
 * Input para número de socio con formato visual (6 dígitos/2 dígitos)
 * Internamente maneja los 8 dígitos sin separador
 */
export function SocioNumberInput({ 
  value, 
  onChange, 
  error,
  required = false 
}: SocioNumberInputProps) {
  // Convertir valor interno (8 dígitos) a formato visual (6/2)
  const displayValue = useMemo(() => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 6) {
      return digits;
    }
    
    // Formato: 6 dígitos / 2 dígitos
    return `${digits.slice(0, 6)}/${digits.slice(6, 8)}`;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remover todo lo que no sea dígito y limitar a 8
    const parsed = inputValue.replace(/\D/g, '').slice(0, 8);
    onChange(parsed); // Enviar solo los dígitos sin formato
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir borrar, tab, flechas, etc.
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      return;
    }
    
    // Solo permitir números
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <FormFieldWrapper
      label="Número de Socio"
      error={error}
      required={required}
    >
      <Input
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="478691/10"
        maxLength={9} // 6 dígitos + 1 barra + 2 dígitos
        aria-invalid={!!error}
        className="text-sm font-mono"
      />
    </FormFieldWrapper>
  );
}
