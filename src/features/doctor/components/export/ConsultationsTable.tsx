'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/shared';
import type { ExportConsultation } from '../../types/export-consultations.types';
import { ConsultationTypeBadge } from '@/features/doctor/components/shared/ConsultationTypeBadge';
import { PatientTypeBadge } from '@/features/doctor/components/shared/PatientTypeBadge';

interface ConsultationsTableProps {
    consultations: ExportConsultation[];
    loading: boolean;
    selectedIds: Set<string>;
    onSelectionChange: (id: string, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
}

export function ConsultationsTable({
    consultations,
    loading,
    selectedIds,
    onSelectionChange,
    onSelectAll,
}: ConsultationsTableProps) {
    const allSelected =
        consultations.length > 0 && consultations.every((c) => selectedIds.has(c.id));

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    if (loading && consultations.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Cargando consultas...</span>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <th className="w-12 p-3">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Seleccionar todas"
                            />
                        </th>
                        <th className="text-left p-3 font-medium">Paciente</th>
                        <th className="text-left p-3 font-medium">Tipo Consulta</th>
                        <th className="text-left p-3 font-medium hidden sm:table-cell">
                            Tipo Paciente
                        </th>
                        <th className="text-left p-3 font-medium hidden md:table-cell">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {consultations.map((consultation) => {
                        const isSelected = selectedIds.has(consultation.id);
                        return (
                            <tr
                                key={consultation.id}
                                className={`border-b hover:bg-muted/30 transition-colors ${
                                    isSelected ? 'bg-muted/50' : ''
                                }`}
                            >
                                <td className="p-3">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) =>
                                            onSelectionChange(consultation.id, checked === true)
                                        }
                                        aria-label={`Seleccionar consulta de ${consultation.patientFullName}`}
                                    />
                                </td>
                                <td className="p-3">
                                    <div className="font-medium">{consultation.patientFullName}</div>
                                    <div className="text-sm text-muted-foreground md:hidden">
                                        {formatDate(consultation.date)}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <ConsultationTypeBadge type={consultation.type} />
                                </td>
                                <td className="p-3 hidden sm:table-cell">
                                    <PatientTypeBadge type={consultation.patientType} />
                                </td>
                                <td className="p-3 hidden md:table-cell">
                                    <div className="text-sm">{formatDate(consultation.date)}</div>
                                </td>
                            </tr>
                        );
                    })}
                    {consultations.length === 0 && !loading && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                No se encontraron consultas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
