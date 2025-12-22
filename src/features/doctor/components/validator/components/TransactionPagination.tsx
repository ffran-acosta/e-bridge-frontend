'use client';

import React from 'react';
import { Button } from '@/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TransactionPagination as PaginationType } from '../types';

interface TransactionPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export function TransactionPagination({ 
  pagination, 
  onPageChange, 
  onLimitChange,
  isLoading = false 
}: TransactionPaginationProps) {
  const { page, limit, total, totalPages } = pagination;

  if (total === 0) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 pt-4 border-t">
      {/* Información de resultados */}
      <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        Mostrando <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{total}</span> transacciones
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Selector de límite */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Por página:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={isLoading}
            className="h-8 px-2 text-xs sm:text-sm border rounded-md bg-background disabled:opacity-50 flex-1 sm:flex-initial min-w-[80px]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1 || isLoading}
            className="h-8 w-8 p-0 hidden sm:flex"
            aria-label="Primera página"
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="h-8 w-8 p-0"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground min-w-[70px] sm:min-w-[80px] text-center">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="h-8 w-8 p-0"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages || isLoading}
            className="h-8 w-8 p-0 hidden sm:flex"
            aria-label="Última página"
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
