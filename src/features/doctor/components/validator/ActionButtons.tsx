'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared';

interface ActionButtonsProps {
  onValidateStatus: () => void;
  onAuthorize: () => void;
  isLoading?: boolean;
}

export function ActionButtons({ onValidateStatus, onAuthorize, isLoading = false }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
      <Button
        onClick={onValidateStatus}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[180px]"
        variant="default"
      >
        <CheckCircle2 className="h-4 w-4" />
        Validar Estado
      </Button>
      <Button
        onClick={onAuthorize}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[180px]"
        variant="default"
      >
        <ShieldCheck className="h-4 w-4" />
        Autorizar
      </Button>
    </div>
  );
}
