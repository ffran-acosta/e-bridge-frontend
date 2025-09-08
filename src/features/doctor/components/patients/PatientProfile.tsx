"use client";

import React, { useState } from "react";
import {
    Button,
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
import { ConsultationsTab } from "./sections/ConsultationsTab";
import { AppointmentsTab } from "./sections/AppoinmentTab";

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
                <TabsList className={`grid w-full ${isARTPatient(patient) ? 'grid-cols-4' : 'grid-cols-3'}`}>
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="consultations">Consultas</TabsTrigger>
                    <TabsTrigger value="appointments">Turnos</TabsTrigger>
                    {/* <TabsTrigger value="documents">Documentos</TabsTrigger> */}
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
                <TabsContent value="consultations" className="space-y-6">
                    <ConsultationsTab patient={patient} />
                </TabsContent>

                {/* Tab: Turnos (Placeholder) */}
                <TabsContent value="appointments" className="space-y-6">
                    <AppointmentsTab patient={patient} />
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
