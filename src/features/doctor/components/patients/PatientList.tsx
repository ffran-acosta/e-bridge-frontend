'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { Search, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Input, SelectItem, SelectContent, SelectTrigger, Select, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared';
import { useDoctorPatients } from '../../hooks/useDoctorPatients';
import { Patient } from '@/shared/types/patients.types';
import { CreatePatientModal } from '../modals/CreatePatientModal';
import { CreatePatientResponse } from '../../types/patient-form.types';

interface PatientsListProps {
    onPatientClick?: (patient: Patient) => void;
}

// Componente principal - Sección de pacientes
export const PatientsList = React.memo(({ onPatientClick }: PatientsListProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Hook integrado con API real
    const {
        patients,
        pagination,
        loading,
        error,
        searchTerm,
        sortBy,
        patientType,
        setSearchTerm,
        setSortBy,
        setPatientType,
        setPage,
        clearError,
        refetch,
    } = useDoctorPatients();

    // Filtrar pacientes localmente por el término de búsqueda
    const filteredPatients = useMemo(() => {
        if (!searchTerm.trim()) return patients;

        const term = searchTerm.toLowerCase();
        return patients.filter(patient =>
            patient.fullName.toLowerCase().includes(term) ||
            patient.dni.includes(term) ||
            patient.email.toLowerCase().includes(term)
        );
    }, [patients, searchTerm]);


    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, [setSearchTerm]);

    const handleRetry = useCallback(() => {
        clearError();
        refetch();
    }, [clearError, refetch]);

    const handleRetry2 = useCallback(() => {
        clearError();
        window.location.reload();
    }, [clearError]);

    const handlePatientCreated = useCallback((patient: CreatePatientResponse) => {
        console.log('Paciente creado exitosamente:', patient);
        // Refrescar la lista de pacientes
        refetch();
        // Cerrar el modal
        setIsCreateModalOpen(false);
    }, [refetch]);


    // Error State
    if (error && !loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-x-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span>Error al cargar pacientes: {error}</span>
                        <Button variant="outline" size="sm" onClick={handleRetry}>
                            Reintentar
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleRetry2}>
                            Recargar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabs para ART y Obra Social/Particulares */}
            <Tabs value={patientType} onValueChange={(value) => setPatientType(value as 'NORMAL' | 'ART')}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ART">Pacientes ART</TabsTrigger>
                    <TabsTrigger value="NORMAL">Obra Social/Particulares</TabsTrigger>
                </TabsList>

                <TabsContent value="NORMAL" className="space-y-6">
                    <PatientContent 
                        patients={filteredPatients}
                        pagination={pagination}
                        loading={loading}
                        error={error}
                        searchTerm={searchTerm}
                        sortBy={sortBy}
                        onSearchChange={handleSearchChange}
                        onSortByChange={setSortBy}
                        onRetry={handleRetry}
                        onRetry2={handleRetry2}
                        onPatientClick={onPatientClick}
                        onPageChange={setPage}
                        patientType="NORMAL"
                        onCreatePatient={() => setIsCreateModalOpen(true)}
                    />
                </TabsContent>

                <TabsContent value="ART" className="space-y-6">
                    <PatientContent 
                        patients={filteredPatients}
                        pagination={pagination}
                        loading={loading}
                        error={error}
                        searchTerm={searchTerm}
                        sortBy={sortBy}
                        onSearchChange={handleSearchChange}
                        onSortByChange={setSortBy}
                        onRetry={handleRetry}
                        onRetry2={handleRetry2}
                        onPatientClick={onPatientClick}
                        onPageChange={setPage}
                        patientType="ART"
                        onCreatePatient={() => setIsCreateModalOpen(true)}
                    />
                </TabsContent>
            </Tabs>

            {/* Modal de creación de pacientes */}
            <CreatePatientModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                defaultType={patientType}
                onSuccess={handlePatientCreated}
                onError={(error) => {
                    console.error('Error al crear paciente:', error);
                }}
            />

        </div>
    );
});

// Componente para el contenido de cada tab
interface PatientContentProps {
    patients: Patient[];
    pagination: any;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    sortBy: string | undefined;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSortByChange: (value: string | undefined) => void;
    onRetry: () => void;
    onRetry2: () => void;
    onPatientClick?: (patient: Patient) => void;
    onPageChange: (page: number) => void;
    patientType: 'NORMAL' | 'ART';
    onCreatePatient: () => void;
}

const PatientContent = React.memo(({
    patients,
    pagination,
    loading,
    error,
    searchTerm,
    sortBy,
    onSearchChange,
    onSortByChange,
    onRetry,
    onRetry2,
    onPatientClick,
    onPageChange,
    patientType,
    onCreatePatient
}: PatientContentProps) => {
    // Error State
    if (error && !loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-x-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span>Error al cargar pacientes: {error}</span>
                        <Button variant="outline" size="sm" onClick={onRetry}>
                            Reintentar
                        </Button>
                        <Button variant="outline" size="sm" onClick={onRetry2}>
                            Recargar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder={`Buscar paciente ${patientType === 'ART' ? 'ART' : 'Obra Social/Particulares'} por nombre, DNI o email...`}
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="pl-9"
                        disabled={loading}
                    />
                </div>

                <div className="flex gap-2 sm:gap-3">
                    {/* Sort Options */}
                    <Select value={sortBy || "lastConsultation"} onValueChange={(value) => onSortByChange(value === "none" ? undefined : value)}>
                        <SelectTrigger className="w-[180px]" disabled={loading}>
                            <SelectValue placeholder="lastConsultation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lastConsultation">Última consulta</SelectItem>
                            <SelectItem value="name">Nombre</SelectItem>
                            <SelectItem value="createdAt">Último creado</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Add Patient Button */}
                    <Button
                        onClick={onCreatePatient}
                        disabled={loading}
                        className="whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Paciente {patientType === 'ART' ? 'ART' : ''}
                    </Button>
                </div>
            </div>

            {/* Patients Table Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span>Pacientes {patientType === 'ART' ? 'ART' : 'Obra Social/Particulares'}</span>
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary">
                                {searchTerm ? patients.length : pagination.total}
                                {searchTerm && ` de ${pagination.total}`} pacientes
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PatientsTable
                        patients={patients}
                        onPatientClick={onPatientClick}
                        loading={loading}
                    />

                     {/* Paginación */}
                     {!searchTerm && pagination.totalPages > 1 && (
                         <div className="flex justify-center mt-4 space-x-2">
                             <Button
                                 variant="outline"
                                 size="sm"
                                 disabled={pagination.page <= 1 || loading}
                                 onClick={() => onPageChange(pagination.page - 1)}
                             >
                                 Anterior
                             </Button>

                             <span className="flex items-center px-4 text-sm text-muted-foreground">
                                 Página {pagination.page} de {pagination.totalPages}
                             </span>

                             <Button
                                 variant="outline"
                                 size="sm"
                                 disabled={pagination.page >= pagination.totalPages || loading}
                                 onClick={() => onPageChange(pagination.page + 1)}
                             >
                                 Siguiente
                             </Button>
                         </div>
                     )}
                </CardContent>
            </Card>
        </>
    );
});

// Tabla de pacientes
const PatientsTable = React.memo(({
    patients,
    onPatientClick,
    loading
}: {
    patients: Patient[],
    onPatientClick?: (patient: Patient) => void,
    loading: boolean
}) => {
    const getStatusBadge = (status: Patient['status']) => {
        const variants = {
            'ATENCION': 'step-2',       // PASO 2 - Amarillo (En proceso)
            'INGRESO': 'step-1',        // PASO 1 - Azul (Inicio)
            'ALTA_MEDICA': 'step-4',    // PASO 4 - Verde (Completado)
            'CIRUGIA': 'surgery'        // ESPECIAL - Púrpura (Cirugía)
        } as const;

        const labels = {
            'ATENCION': 'Atención',
            'INGRESO': 'Ingreso',
            'ALTA_MEDICA': 'Alta Médica',
            'CIRUGIA': 'Cirugía'
        };

        return <Badge variant={variants[status]}>{labels[status]}</Badge>;
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getGenderLabel = (gender: Patient['gender']) => {
        const labels = {
            'FEMENINO': 'Femenino',
            'MASCULINO': 'Masculino',
            'NO_BINARIO': 'No Binario'
        };
        return labels[gender] || gender;
    };

    if (loading && patients.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Cargando pacientes...</span>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <th className="text-left p-3 font-medium">Paciente</th>
                        <th className="text-left p-3 font-medium hidden sm:table-cell">DNI</th>
                        <th className="text-left p-3 font-medium">Estado</th>
                        <th className="text-left p-3 font-medium hidden md:table-cell">Última Consulta</th>
                        <th className="text-left p-3 font-medium hidden lg:table-cell">Obra Social</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr 
                            key={patient.id} 
                            className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => onPatientClick?.(patient)}
                            >
                            <td className="p-3">
                                <div>
                                    <div className="font-medium">{patient.fullName}</div>
                                    <div className="text-sm text-muted-foreground sm:hidden">
                                        DNI: {patient.dni} • {patient.age} años
                                    </div>
                                </div>
                            </td>
                            <td className="p-3 hidden sm:table-cell">
                                <div>
                                    <div className="text-sm">{patient.dni}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {patient.age} años • {getGenderLabel(patient.gender)}
                                    </div>
                                </div>
                            </td>
                            <td className="p-3">{getStatusBadge(patient.status)}</td>
                            <td className="p-3 hidden md:table-cell">
                                {formatDate(patient.lastConsultationDate)}
                            </td>
                            <td className="p-3 hidden lg:table-cell">
                                <span className="text-sm">{patient.insuranceName}</span>
                            </td>
                        </tr>
                    ))}
                    {patients.length === 0 && !loading && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                No se encontraron pacientes
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
});
