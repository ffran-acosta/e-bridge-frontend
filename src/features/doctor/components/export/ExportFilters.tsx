'use client';

import React, { useCallback, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared';
import { DateTimeInput } from '../modals/shared/DateTimeInput';
import type {
    ExportConsultationsParams,
    ConsultationType,
    PatientType,
} from '../../types/export-consultations.types';

interface ExportFiltersProps {
    filters: ExportConsultationsParams;
    onFiltersChange: (filters: Partial<ExportConsultationsParams>) => void;
    loading: boolean;
}

export function ExportFilters({
    filters,
    onFiltersChange,
    loading,
}: ExportFiltersProps) {
    const [localSearch, setLocalSearch] = useState(filters.search || '');

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalSearch(e.target.value);
        },
        []
    );

    const handleSearchSubmit = useCallback(() => {
        onFiltersChange({ search: localSearch || undefined });
    }, [localSearch, onFiltersChange]);

    const handleSearchKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleSearchSubmit();
            }
        },
        [handleSearchSubmit]
    );

    const handleClearFilters = useCallback(() => {
        setLocalSearch('');
        onFiltersChange({
            search: undefined,
            patientType: undefined,
            type: undefined,
            startDate: undefined,
            endDate: undefined,
            patientId: undefined,
            page: 1,
        });
    }, [onFiltersChange]);

    const hasActiveFilters = Boolean(
        filters.search ||
        filters.patientType ||
        filters.type ||
        filters.startDate ||
        filters.endDate ||
        filters.patientId
    );

    // Convertir fecha ISO a formato date-local para los inputs
    const formatDateForInput = (isoDate?: string) => {
        if (!isoDate) return '';
        try {
            const date = new Date(isoDate);
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    const handleDateChange = useCallback(
        (field: 'startDate' | 'endDate', value: string) => {
            if (!value) {
                onFiltersChange({ [field]: undefined });
                return;
            }
            // Convertir a ISO string (medianoche UTC del día seleccionado)
            const date = new Date(value);
            date.setHours(0, 0, 0, 0);
            onFiltersChange({ [field]: date.toISOString() });
        },
        [onFiltersChange]
    );

    return (
        <div className="space-y-4">
            {/* Búsqueda y filtros principales */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Buscar por nombre de paciente..."
                        value={localSearch}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        className="pl-9"
                        disabled={loading}
                    />
                </div>
                <Button
                    onClick={handleSearchSubmit}
                    disabled={loading}
                    variant="outline"
                >
                    Buscar
                </Button>
                {hasActiveFilters && (
                    <Button
                        onClick={handleClearFilters}
                        disabled={loading}
                        variant="ghost"
                        size="sm"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Filtros avanzados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipo de Paciente */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">
                        Tipo de Paciente
                    </label>
                    <Select
                        value={filters.patientType || 'all'}
                        onValueChange={(value) =>
                            onFiltersChange({
                                patientType: value === 'all' ? undefined : (value as PatientType),
                            })
                        }
                        disabled={loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tipo de Paciente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los tipos</SelectItem>
                            <SelectItem value="ART">ART</SelectItem>
                            <SelectItem value="NORMAL">Normal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tipo de Consulta */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">
                        Tipo de Consulta
                    </label>
                    <Select
                        value={filters.type || 'all'}
                        onValueChange={(value) =>
                            onFiltersChange({
                                type: value === 'all' ? undefined : (value as ConsultationType),
                            })
                        }
                        disabled={loading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tipo de Consulta" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las consultas</SelectItem>
                            <SelectItem value="INGRESO">Ingreso</SelectItem>
                            <SelectItem value="ATENCION">Atención</SelectItem>
                            <SelectItem value="ALTA">Alta</SelectItem>
                            <SelectItem value="REINGRESO">Reingreso</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Fecha Desde */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Desde</label>
                    <DateTimeInput
                        type="date"
                        placeholder="Fecha desde"
                        value={formatDateForInput(filters.startDate)}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* Fecha Hasta */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Hasta</label>
                    <DateTimeInput
                        type="date"
                        placeholder="Fecha hasta"
                        value={formatDateForInput(filters.endDate)}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        disabled={loading}
                        min={filters.startDate ? formatDateForInput(filters.startDate) : undefined}
                    />
                </div>
            </div>
        </div>
    );
}
