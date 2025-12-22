'use client';

import React, { useState, useEffect } from 'react';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from '@/shared';
import { X, Filter } from 'lucide-react';
import type { OperationType, TransactionStatus, TransactionFilters } from '../types';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: Partial<TransactionFilters>) => void;
  onClearFilters: () => void;
}

const operationTypeLabels: Record<OperationType, string> = {
  ELG: 'Elegibilidad',
  AP: 'Autorizaci?n',
  ATR: 'Anulaci?n',
  RA: 'Recuperar Autorizaci?n',
  LT: 'Listar',
};

// Tipos de operaci?n que se muestran en el filtro (excluyendo RA y LT que son acciones separadas)
const filterableOperationTypes: OperationType[] = ['ELG', 'AP', 'ATR'];

const statusLabels: Record<NonNullable<TransactionStatus>, string> = {
  OK: 'Exitoso',
  NO: 'Fallido',
  PEND: 'Pendiente',
};

export function TransactionFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClearFilters
}: TransactionFiltersProps) {
  // Estado local solo para los inputs de texto (con debounce)
  const [localCodigoSocio, setLocalCodigoSocio] = useState(filters.codigoSocio || '');
  const [localIdTransaccion, setLocalIdTransaccion] = useState(filters.idTransaccion || '');
  const [localIdAutorizacion, setLocalIdAutorizacion] = useState(filters.idAutorizacion || '');

  // Sincronizar estado local cuando cambian los filtros externos (ej: al limpiar)
  useEffect(() => {
    setLocalCodigoSocio(filters.codigoSocio || '');
    setLocalIdTransaccion(filters.idTransaccion || '');
    setLocalIdAutorizacion(filters.idAutorizacion || '');
  }, [filters.codigoSocio, filters.idTransaccion, filters.idAutorizacion]);

  // Debounce para codigoSocio - limpiar la barra y enviar solo n?meros
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = localCodigoSocio.trim();
      const cleaned = value ? value.replace(/\D/g, '') : '';
      onFiltersChange({ 
        codigoSocio: cleaned || undefined 
      });
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localCodigoSocio]);

  // Debounce para idTransaccion
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = localIdTransaccion.trim();
      onFiltersChange({ 
        idTransaccion: value || undefined 
      });
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localIdTransaccion]);

  // Debounce para idAutorizacion
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = localIdAutorizacion.trim();
      onFiltersChange({ 
        idAutorizacion: value || undefined 
      });
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localIdAutorizacion]);

  const hasActiveFilters = Boolean(
    filters.operationType || 
    filters.status || 
    filters.codigoSocio || 
    filters.fechaDesde || 
    filters.fechaHasta ||
    filters.idTransaccion ||
    filters.idAutorizacion
  );

  return (
    <div className="space-y-2 sm:space-y-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Limpiar</span>
            <span className="sm:hidden">Limpiar</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {/* Tipo de Operaci?n */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Tipo de Operaci?n</label>
          <Select
            value={filters.operationType || 'all'}
            onValueChange={(value) => 
              onFiltersChange({ operationType: value === 'all' ? undefined : (value as OperationType) })
            }
          >
            <SelectTrigger className="h-8 text-xs sm:text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {filterableOperationTypes.map((value) => (
                <SelectItem key={value} value={value}>
                  {operationTypeLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Estado</label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => 
              onFiltersChange({ status: value === 'all' ? undefined : (value as TransactionStatus) })
            }
          >
            <SelectTrigger className="h-8 text-xs sm:text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha Desde */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Fecha Desde</label>
          <Input
            type="date"
            value={filters.fechaDesde || ''}
            onChange={(e) => onFiltersChange({ fechaDesde: e.target.value || undefined })}
            className="h-8 text-xs sm:text-sm"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Fecha Hasta</label>
          <Input
            type="date"
            value={filters.fechaHasta || ''}
            onChange={(e) => onFiltersChange({ fechaHasta: e.target.value || undefined })}
            className="h-8 text-xs sm:text-sm"
          />
        </div>

        {/* C?digo de Socio */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">C?digo de Socio</label>
          <Input
            value={localCodigoSocio}
            onChange={(e) => setLocalCodigoSocio(e.target.value)}
            placeholder="000000/00"
            className="h-8 text-xs sm:text-sm font-mono"
          />
        </div>

        {/* ID Transacci?n */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Transacci?n</label>
          <Input
            value={localIdTransaccion}
            onChange={(e) => setLocalIdTransaccion(e.target.value)}
            placeholder="123456789"
            className="h-8 text-xs sm:text-sm font-mono"
          />
        </div>

        {/* ID Autorizaci?n */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Autorizaci?n</label>
          <Input
            value={localIdAutorizacion}
            onChange={(e) => setLocalIdAutorizacion(e.target.value)}
            placeholder="1038960904"
            className="h-8 text-xs sm:text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
}
