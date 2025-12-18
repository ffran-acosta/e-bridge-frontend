'use client';

import React from 'react';
import { Badge } from '@/shared';

export type PatientTypeValue = 'ART' | 'NORMAL' | string;

interface PatientTypeBadgeProps {
  type: PatientTypeValue | null | undefined;
  className?: string;
}

export function PatientTypeBadge({ type, className }: PatientTypeBadgeProps) {
  if (!type) return null;

  const normalized = String(type).toUpperCase();
  const isArt = normalized === 'ART';

  const baseClasses = isArt
    ? 'bg-white border-gray-300'
    : 'bg-gray-200 border-gray-400';

  return (
    <Badge
      variant="outline"
      className={`${baseClasses} text-xs font-medium px-2 py-0.5 rounded-sm text-black ${className ?? ''}`}
    >
      {isArt ? 'ART' : 'Normal'}
    </Badge>
  );
}


