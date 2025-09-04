"use client";

import React, { useState } from "react";
import {
    Calendar,
    Plus,
    FileText
} from "lucide-react";
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/shared";
import { usePatientProfile } from "../../hooks/usePatientProfile";
import { PatientHeader } from "./sections/PatientHeader";
import { OverviewTab } from "./sections/OverviewTab";
import { isARTPatient } from "../../utils/patientMappers";
import { SiniestroTab } from "./sections/SiniestroTab";

interface PatientProfileProps {
    patientId?: string;
}

export function PatientProfile({ patientId }: PatientProfileProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Hook para obtener datos del paciente
    const { patient, loading, error, refetch, clearError } = usePatientProfile(patientId);

    // Handlers para acciones del header
    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleExport = () => {
        // TODO: Implementar exportación
        console.log("Exportar perfil del paciente");
    };

    // Estados de carga y error
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando perfil del paciente...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => { clearError(); refetch(); }}>
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-muted-foreground">No se encontró el paciente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header del Paciente */}
            <PatientHeader
                patient={patient}
                onEdit={handleEdit}
                onExport={handleExport}
            />

            {/* Tabs para diferentes secciones */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={`grid w-full ${isARTPatient(patient) ? 'grid-cols-5' : 'grid-cols-4'}`}>
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="consultations">Consultas</TabsTrigger>
                    <TabsTrigger value="appointments">Turnos</TabsTrigger>
                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                    {isARTPatient(patient) && (
                        <TabsTrigger value="siniestro">Siniestro</TabsTrigger>
                    )}
                </TabsList>

                {/* Tab: Resumen */}
                <TabsContent value="overview" className="space-y-6">
                    <OverviewTab patient={patient} />
                </TabsContent>

                {isARTPatient(patient) && (
                    <TabsContent value="siniestro" className="space-y-6">
                        <SiniestroTab patient={patient} />
                    </TabsContent>
                )}

                {/* Tab: Consultas (Placeholder) */}
                <TabsContent value="consultations" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Historial de Consultas</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Consulta
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground py-12">
                                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Las consultas se implementarán próximamente</p>
                                <p className="text-sm">
                                    Total de consultas: {patient.stats.totalConsultations}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Turnos (Placeholder) */}
                <TabsContent value="appointments" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Próximos Turnos</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Turno
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground py-12">
                                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Los turnos se implementarán próximamente</p>
                                <p className="text-sm">
                                    Total de turnos: {patient.stats.totalAppointments}
                                </p>
                                {patient.stats.nextAppointmentDate && (
                                    <p className="text-sm">
                                        Próximo turno: {new Date(patient.stats.nextAppointmentDate).toLocaleDateString('es-AR')}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Documentos (Placeholder) */}
                <TabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Documentos</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Subir Documento
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground py-12">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No hay documentos subidos aún</p>
                                <p className="text-sm">Los estudios médicos, radiografías y reportes aparecerán aquí</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal de edición (placeholder) */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Paciente</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-muted-foreground">
                            El formulario de edición se implementará en la siguiente fase.
                        </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={() => setIsEditModalOpen(false)}>
                            Guardar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
