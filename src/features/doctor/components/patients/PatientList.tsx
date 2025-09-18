'use client';

import React, { useState, useMemo } from 'react';
import { Search, Eye, X, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Input, Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SelectItem, SelectContent, SelectTrigger, Select, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared';
import { useDoctorPatients } from '../../hooks/useDoctorPatients';
import { Patient } from '@/shared/types/patients.types';

interface PatientsListProps {
    onPatientClick?: (patient: Patient) => void;
}

// Componente principal - Sección de pacientes
export function PatientsList({ onPatientClick }: PatientsListProps) {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

    const handlePatientPreview = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsPreviewOpen(true);
    };

    const handleViewFullProfile = () => {
        if (selectedPatient && onPatientClick) {
            onPatientClick(selectedPatient);
            setIsPreviewOpen(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleRetry = () => {
        clearError();
        refetch();
    };
    const handleRetry2 = () => {
        clearError();
        window.location.reload();
    };


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
                        onPatientClick={handlePatientPreview}
                        onPageChange={setPage}
                        patientType="NORMAL"
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
                        onPatientClick={handlePatientPreview}
                        onPageChange={setPage}
                        patientType="ART"
                    />
                </TabsContent>
            </Tabs>

            {/* Patient Preview Sheet */}
            <PatientPreviewSheet
                patient={selectedPatient}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                onViewFullProfile={handleViewFullProfile}
            />
        </div>
    );
}

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
    onPatientClick: (patient: Patient) => void;
    onPageChange: (page: number) => void;
    patientType: 'NORMAL' | 'ART';
}

const PatientContent = ({
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
    patientType
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
                        onClick={() => console.log(`Agregar paciente ${patientType} - funcionalidad pendiente`)}
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
};

// Tabla de pacientes
const PatientsTable = ({
    patients,
    onPatientClick,
    loading
}: {
    patients: Patient[],
    onPatientClick: (patient: Patient) => void,
    loading: boolean
}) => {
    const getStatusBadge = (status: Patient['status']) => {
        const variants = {
            'ATENCION': 'default',
            'INGRESO': 'secondary',
            'ALTA_MEDICA': 'outline',
            'CIRUGIA': 'destructive'
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
                        <th className="text-left p-3 font-medium">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr 
                            key={patient.id} 
                            className="border-b hover:bg-muted/30 transition-colors"
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
                            <td className="p-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPatientClick(patient)}
                                    disabled={loading}
                                >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Ver preview</span>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {patients.length === 0 && !loading && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                No se encontraron pacientes
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Preview del paciente en Sheet
const PatientPreviewSheet = ({
    patient,
    isOpen,
    onClose,
    onViewFullProfile
}: {
    patient: Patient | null,
    isOpen: boolean,
    onClose: () => void,
    onViewFullProfile: () => void
}) => {
    if (!patient) return null;

    const getStatusBadge = (status: Patient['status']) => {
        const variants = {
            'ATENCION': 'default',
            'INGRESO': 'secondary',
            'ALTA_MEDICA': 'outline',
            'CIRUGIA': 'destructive'
        } as const;

        const labels = {
            'ATENCION': 'Atención',
            'INGRESO': 'Ingreso',
            'ALTA_MEDICA': 'Alta Médica',
            'CIRUGIA': 'Cirugía'
        };

        return <Badge variant={variants[status]}>{labels[status]}</Badge>;
    };

    const getGenderLabel = (gender: Patient['gender']) => {
        const labels = {
            'FEMENINO': 'Femenino',
            'MASCULINO': 'Masculino',
            'NO_BINARIO': 'No Binario'
        };
        return labels[gender] || gender;
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

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <div className="flex items-center justify-between">
                        <SheetTitle>Vista Rápida</SheetTitle>
                        {/* <SheetClose asChild>
                            <Button variant="ghost" size="sm">
                                <X className="h-4 w-4" />
                            </Button>
                        </SheetClose> */}
                    </div>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{patient.fullName}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Información básica */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">DNI</label>
                                    <p className="text-sm">{patient.dni}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Edad</label>
                                    <p className="text-sm">{patient.age} años</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Género</label>
                                    <p className="text-sm">{getGenderLabel(patient.gender)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Estado Actual</label>
                                    <div className="mt-1">
                                        {getStatusBadge(patient.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Obra Social */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Obra Social</label>
                                <p className="text-sm">{patient.insuranceName}</p>
                            </div>

                            {/* Última consulta */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Última Consulta</label>
                                <p className="text-sm">{formatDate(patient.lastConsultationDate)}</p>
                            </div>

                            {/* Información de contacto */}
                            <div className="grid grid-cols-1 gap-2 pt-2 border-t">
                                <div className="text-sm">
                                    <span className="font-medium text-muted-foreground">Teléfono:</span>
                                    <span className="ml-2">{patient.phone}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium text-muted-foreground">Email:</span>
                                    <span className="ml-2 break-all">{patient.email}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium text-muted-foreground">Dirección:</span>
                                    <span className="ml-2">{patient.address}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button onClick={onViewFullProfile} className="flex-1">
                            Ver Perfil 
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};