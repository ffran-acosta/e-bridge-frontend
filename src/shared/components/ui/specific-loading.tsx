'use client';

import { TableSkeleton, CardSkeleton } from './loading-states';
import { Skeleton } from './skeleton';

// Loading específico para listas de pacientes
export const PatientListLoading = () => (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
        <TableSkeleton rows={5} columns={5} />
    </div>
);

// Loading específico para perfil de paciente
export const PatientProfileLoading = () => (
    <div className="space-y-6">
        {/* Header del paciente */}
        <div className="flex items-start justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
            {['Resumen', 'Consultas', 'Turnos'].map((tab, index) => (
                <Skeleton key={index} className="h-10 w-24" />
            ))}
        </div>

        {/* Contenido del tab */}
        <CardSkeleton count={3} />
    </div>
);

// Loading específico para calendario
export const CalendarLoading = () => (
    <div className="space-y-6">
        {/* Header del calendario */}
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-1">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-16" />
            </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center space-y-2">
                    <Skeleton className="h-8 w-12 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                </div>
            ))}
        </div>

        {/* Calendario */}
        <div className="border rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
                {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                ))}
            </div>
        </div>
    </div>
);

// Loading específico para dashboard
export const DashboardLoading = () => (
    <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                </div>
            ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <TableSkeleton rows={4} columns={3} />
            </div>
            <div className="border rounded-lg p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <TableSkeleton rows={4} columns={3} />
            </div>
        </div>
    </div>
);

// Loading específico para formularios
export const FormLoading = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
        </div>
    </div>
);

// Loading específico para modales
export const ModalLoading = () => (
    <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-6" />
        </div>
        <FormLoading />
    </div>
);

// Loading específico para búsquedas
export const SearchLoading = () => (
    <div className="space-y-4">
        <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border rounded">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                </div>
            ))}
        </div>
    </div>
);
