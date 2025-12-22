'use client';

import React, { useState, useEffect } from 'react';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from '@/shared';
import { X, Filter, Search } from 'lucide-react';
import type { OperationType, TransactionStatus, TransactionFilters } from '../types';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: Partial<TransactionFilters>) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const operationTypeLabels: Record<OperationType, string> = {
  ELG: 'Elegibilidad',
  AP: 'Autorización',
  ATR: 'Anulación',
  RA: 'Recuperar Autorización',
  LT: 'Listar',
};

// Tipos de operación que se muestran en el filtro (excluyendo RA y LT que son acciones separadas)
const filterableOperationTypes: OperationType[] = ['ELG', 'AP', 'ATR'];

const statusLabels: Record<NonNullable<TransactionStatus>, string> = {
  OK: 'Exitoso',
  NO: 'Fallido',
  PEND: 'Pendiente',
};

export function TransactionFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onApplyFilters,
  onClearFilters,
  isLoading = false
}: TransactionFiltersProps) {
  // Estado local para TODOS los filtros (no se aplican hasta presionar el botón)
  const [localFilters, setLocalFilters] = useState<Partial<TransactionFilters>>({
    operationType: filters.operationType,
    status: filters.status,
    codigoSocio: filters.codigoSocio || '',
    fechaDesde: filters.fechaDesde,
    fechaHasta: filters.fechaHasta,
    idTransaccion: filters.idTransaccion || '',
    idAutorizacion: filters.idAutorizacion || '',
  });

  // Sincronizar estado local cuando cambian los filtros externos (ej: al limpiar)
  useEffect(() => {
    setLocalFilters({
      operationType: filters.operationType,
      status: filters.status,
      codigoSocio: filters.codigoSocio || '',
      fechaDesde: filters.fechaDesde,
      fechaHasta: filters.fechaHasta,
      idTransaccion: filters.idTransaccion || '',
      idAutorizacion: filters.idAutorizacion || '',
    });
  }, [filters]);

  const handleApplyFilters = () => {
    // Limpiar código de socio: remover la barra y cualquier carácter no numérico
    // El código de socio son 6+2=8 dígitos, pero puede venir con 3 más (token) = 11
    const codigoSocioCleaned = localFilters.codigoSocio?.trim()
      ? localFilters.codigoSocio.trim().replace(/\D/g, '') // Solo números
      : undefined;

    // Aplicar todos los filtros locales al estado global y hacer la petición
    const filtersToApply: Partial<TransactionFilters> = {
      operationType: localFilters.operationType,
      status: localFilters.status,
      codigoSocio: codigoSocioCleaned || undefined,
      fechaDesde: localFilters.fechaDesde,
      fechaHasta: localFilters.fechaHasta,
      idTransaccion: localFilters.idTransaccion?.trim() || undefined,
      idAutorizacion: localFilters.idAutorizacion?.trim() || undefined,
    };
    
    onFiltersChange(filtersToApply);
    onApplyFilters();
  };

  const hasActiveFilters = Boolean(
    localFilters.operationType || 
    localFilters.status || 
    localFilters.codigoSocio || 
    localFilters.fechaDesde || 
    localFilters.fechaHasta ||
    localFilters.idTransaccion ||
    localFilters.idAutorizacion
  );

  return (
    <div className="space-y-2 sm:space-y-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
          Filtros
        </h3>
        <div className="flex items-center gap-2">
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
          <Button
            variant="default"
            size="sm"
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="h-7 text-xs"
          >
            <Search className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Buscar</span>
            <span className="sm:hidden">Buscar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {/* Tipo de Operación */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Tipo de Operación</label>
          <Select
            value={localFilters.operationType || 'all'}
            onValueChange={(value) => 
              setLocalFilters({ ...localFilters, operationType: value === 'all' ? undefined : (value as OperationType) })
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
            value={localFilters.status || 'all'}
            onValueChange={(value) => 
              setLocalFilters({ ...localFilters, status: value === 'all' ? undefined : (value as TransactionStatus) })
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
            value={localFilters.fechaDesde || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, fechaDesde: e.target.value || undefined })}
            className="h-8 text-xs sm:text-sm"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Fecha Hasta</label>
          <Input
            type="date"
            value={localFilters.fechaHasta || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, fechaHasta: e.target.value || undefined })}
            className="h-8 text-xs sm:text-sm"
          />
        </div>

        {/* Código de Socio */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Código de Socio</label>
          <Input
            value={localFilters.codigoSocio || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, codigoSocio: e.target.value })}
            placeholder="000000/00"
            className="h-8 text-xs sm:text-sm font-mono"
          />
        </div>

        {/* ID Transacción */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Transacción</label>
          <Input
            value={localFilters.idTransaccion || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, idTransaccion: e.target.value })}
            placeholder="123456789"
            className="h-8 text-xs sm:text-sm font-mono"
          />
        </div>

        {/* ID Autorización */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Autorización</label>
          <Input
            value={localFilters.idAutorizacion || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, idAutorizacion: e.target.value })}
            placeholder="1038960904"
            className="h-8 text-xs sm:text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
}
