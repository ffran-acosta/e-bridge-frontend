'use client';

import React from 'react';
import { Badge } from '@/shared';
import type { TransactionStatus } from '../types';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

// Colores siguiendo el patrón de StatusBadge (texto negro, colores suaves)
const STATUS_COLOR_CLASSES: Record<NonNullable<TransactionStatus>, string> = {
  OK: 'bg-green-200 border-green-400',
  NO: 'bg-red-200 border-red-400',
  PEND: 'bg-yellow-200 border-yellow-400',
};

const STATUS_LABELS: Record<NonNullable<TransactionStatus>, string> = {
  OK: 'Exitoso',
  NO: 'Fallido',
  PEND: 'Pendiente',
};

export function TransactionStatusBadge({ status, className }: TransactionStatusBadgeProps) {
  if (status === null) {
    return (
      <Badge
        variant="outline"
        className="bg-gray-200 border-gray-400 text-xs font-medium px-2 py-0.5 rounded-sm text-black"
      >
        Sin estado
      </Badge>
    );
  }

  const baseClasses = STATUS_COLOR_CLASSES[status];

  return (
    <Badge
      variant="outline"
      className={`${baseClasses} text-xs font-medium px-2 py-0.5 rounded-sm text-black ${className ?? ''}`}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
