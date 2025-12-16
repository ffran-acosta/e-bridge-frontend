'use client';

import React from 'react';
import { Badge } from '@/shared';
import { getConsultationTypeLabel } from '@/features/doctor/utils/consultationFormatters';

interface ConsultationTypeBadgeProps {
  type: string | null | undefined;
  className?: string;
}

// Colores más fuertes por tipo de consulta (basados en los colores originales)
const TYPE_COLOR_CLASSES: Record<string, string> = {
  INGRESO: 'bg-blue-200 border-blue-400',
  ATENCION: 'bg-yellow-200 border-yellow-400',
  ALTA: 'bg-green-200 border-green-400',
  REINGRESO: 'bg-orange-200 border-orange-400',
};

export function ConsultationTypeBadge({ type, className }: ConsultationTypeBadgeProps) {
  if (!type) return null;

  const normalized = String(type).toUpperCase();
  const baseClasses = TYPE_COLOR_CLASSES[normalized] ?? 'bg-gray-200 border-gray-400';

  return (
    <Badge
      variant="outline"
      className={`${baseClasses} text-xs font-medium px-2 py-0.5 rounded-sm text-black ${className ?? ''}`}
    >
      {getConsultationTypeLabel(normalized)}
    </Badge>
  );
}

