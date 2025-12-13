'use client';

import React, { useCallback, useState } from 'react';
import { AlertCircle, Loader2, Download } from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { useExportConsultations } from '../../hooks/useExportConsultations';
import { ExportFilters } from './ExportFilters';
import { ConsultationsTable } from './ConsultationsTable';

export function ExportView() {
    const {
        consultations,
        pagination,
        loading,
        error,
        filters,
        setFilters,
        refetch,
        clearError,
    } = useExportConsultations();

    // Estado para las consultas seleccionadas
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Manejar selección individual
    const handleSelectionChange = useCallback((id: string, selected: boolean) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    }, []);

    // Manejar seleccionar todas
    const handleSelectAll = useCallback(
        (selected: boolean) => {
            if (selected) {
                setSelectedIds(new Set(consultations.map((c) => c.id)));
            } else {
                setSelectedIds(new Set());
            }
        },
        [consultations]
    );

    // Manejar exportar (por ahora solo muestra las seleccionadas)
    const handleExport = useCallback(() => {
        const selectedConsultations = consultations.filter((c) => selectedIds.has(c.id));
        console.log('Consultas seleccionadas para exportar:', selectedConsultations);
        // TODO: Implementar exportación a PDF
        alert(`Se exportarán ${selectedConsultations.length} consultas (funcionalidad de PDF pendiente)`);
    }, [consultations, selectedIds]);

    // Limpiar selección cuando cambian los filtros o la página
    React.useEffect(() => {
        setSelectedIds(new Set());
    }, [filters.page, filters.patientType, filters.type, filters.startDate, filters.endDate, filters.search]);

    const handleRetry = useCallback(() => {
        clearError();
        refetch();
    }, [clearError, refetch]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setFilters({ page: newPage });
        },
        [setFilters]
    );

    // Error State
    if (error && !loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-x-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span>Error al cargar consultas: {error}</span>
                        <Button variant="outline" size="sm" onClick={handleRetry}>
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <ExportFilters
                filters={filters}
                onFiltersChange={setFilters}
                loading={loading}
            />

            {/* Tabla de Consultas */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <CardTitle className="flex items-center space-x-2">
                            <span>Consultas para Exportar</span>
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        </CardTitle>
                        {selectedIds.size > 0 && (
                            <Button
                                onClick={handleExport}
                                disabled={loading}
                                className="flex items-center space-x-2"
                            >
                                <Download className="h-4 w-4" />
                                <span>Exportar {selectedIds.size} consulta{selectedIds.size !== 1 ? 's' : ''}</span>
                            </Button>
                        )}
                    </div>
                    {pagination && (
                        <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                {pagination.total} consultas
                            </Badge>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <ConsultationsTable
                        consultations={consultations}
                        loading={loading}
                        selectedIds={selectedIds}
                        onSelectionChange={handleSelectionChange}
                        onSelectAll={handleSelectAll}
                    />

                    {/* Paginación */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page <= 1 || loading}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Anterior
                            </Button>

                            <span className="flex items-center px-4 text-sm text-muted-foreground">
                                Página {pagination.page} de {pagination.pages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.page >= pagination.pages || loading}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
