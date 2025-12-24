"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import { useSpecialties } from "../../hooks/useSpecialties";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared";

interface SpecialtySelectFieldProps {
  control: Control<any>;
  name: string;
  errors?: FieldErrors<any>;
  label?: string;
}

export function SpecialtySelectField({
  control,
  name,
  errors,
  label = "Especialidad",
}: SpecialtySelectFieldProps) {
  const { specialties, loading: specialtiesLoading, error: specialtiesError } = useSpecialties();

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value ?? ""} onValueChange={field.onChange} disabled={specialtiesLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={specialtiesLoading ? "Cargando especialidades..." : "Seleccioná una especialidad"} />
            </SelectTrigger>
            <SelectContent>
              {specialties.length === 0 && !specialtiesLoading ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No hay especialidades disponibles
                </div>
              ) : (
                specialties.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />
      {specialtiesError && (
        <p className="text-sm text-destructive">Error al cargar especialidades: {specialtiesError}</p>
      )}
      {errors?.[name] && (
        <p className="text-sm text-destructive">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}

