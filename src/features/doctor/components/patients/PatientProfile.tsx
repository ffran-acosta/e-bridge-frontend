"use client";

import React, { useState, useCallback } from "react";
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
import { isARTPatient } from "../../utils/patientFormatters";
import { SiniestroTab } from "./sections/SiniestroTab";
import { ConsultationsTab } from "./sections/ConsultationsTab";
import { AppointmentsTab } from "./sections/AppoinmentTab";
import { ConsultationTypeModal } from "../modals/ConsultationTypeModal";
import { CreateConsultationModal } from "../modals/CreateConsultationModal";
import { EditPatientModal } from "../modals/EditPatientModal";

interface PatientProfileProps {
    patientId?: string;
}

export const PatientProfile = React.memo(({ patientId }: PatientProfileProps) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConsultationTypeModalOpen, setIsConsultationTypeModalOpen] = useState(false);
    const [isCreateConsultationModalOpen, setIsCreateConsultationModalOpen] = useState(false);
    const [selectedConsultationType, setSelectedConsultationType] = useState<'ATENCION' | 'ALTA' | null>(null);

    // Hook para obtener datos del paciente
    const { patient, loading, error, refetch, clearError } = usePatientProfile(patientId);

    // Handlers para acciones del header
    const handleEdit = useCallback(() => {
        setIsEditModalOpen(true);
    }, []);


    const handleContinueSiniestro = useCallback(() => {
        setIsConsultationTypeModalOpen(true);
    }, []);

    const handleSelectConsultationType = useCallback((type: 'ATENCION' | 'ALTA') => {
        setSelectedConsultationType(type);
        setIsConsultationTypeModalOpen(false);
        setIsCreateConsultationModalOpen(true);
    }, []);

    const handleConsultationSuccess = useCallback(() => {
        setIsCreateConsultationModalOpen(false);
        setSelectedConsultationType(null);
        refetch(); // Recargar datos del paciente
    }, [refetch]);

    const handleConsultationError = useCallback((error: string) => {
        console.error('Error al crear consulta:', error);
        // TODO: Mostrar error al usuario
    }, []);

    const handleEditSuccess = useCallback(() => {
        refetch(); // Recargar datos del paciente después de la edición
    }, [refetch]);

    const handleEditError = useCallback((error: string) => {
        console.error('Error al editar paciente:', error);
        // TODO: Mostrar error al usuario
    }, []);

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
                onContinueSiniestro={handleContinueSiniestro}
            />

            {/* Tabs para diferentes secciones */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={`grid w-full ${isARTPatient(patient) ? 'grid-cols-4' : 'grid-cols-3'}`}>
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    {isARTPatient(patient) && (
                        <TabsTrigger value="siniestro">Siniestro</TabsTrigger>
                    )}
                    <TabsTrigger value="consultations">Consultas</TabsTrigger>
                    <TabsTrigger value="appointments">Turnos</TabsTrigger>
                    {/* <TabsTrigger value="documents">Documentos</TabsTrigger> */}
                </TabsList>

                {/* Tab: Resumen */}
                <TabsContent value="overview" className="space-y-6">
                    <OverviewTab patient={patient} />
                </TabsContent>

                {/* Tab: Siniestro (solo para pacientes ART) */}
                {isARTPatient(patient) && (
                    <TabsContent value="siniestro" className="space-y-6">
                        <SiniestroTab patient={patient} />
                    </TabsContent>
                )}

                {/* Tab: Consultas */}
                <TabsContent value="consultations" className="space-y-6">
                    <ConsultationsTab patient={patient} />
                </TabsContent>

                {/* Tab: Turnos (Placeholder) */}
                <TabsContent value="appointments" className="space-y-6">
                    <AppointmentsTab patient={patient} />
                </TabsContent>
            </Tabs>

            {/* Modal de edición de paciente */}
            <EditPatientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                patientId={patient.id}
                patientData={patient}
                onSuccess={handleEditSuccess}
                onError={handleEditError}
            />

            {/* Modal para seleccionar tipo de consulta */}
            <ConsultationTypeModal
                isOpen={isConsultationTypeModalOpen}
                onClose={() => setIsConsultationTypeModalOpen(false)}
                onSelectType={handleSelectConsultationType}
                patientName={`${patient.firstName} ${patient.lastName}`}
            />

            {/* Modal para crear consulta */}
            {selectedConsultationType && (
                <CreateConsultationModal
                    isOpen={isCreateConsultationModalOpen}
                    onClose={() => {
                        setIsCreateConsultationModalOpen(false);
                        setSelectedConsultationType(null);
                    }}
                    patientId={patient.id}
                    patientName={`${patient.firstName} ${patient.lastName}`}
                    isArtCase={isARTPatient(patient)}
                    defaultConsultationType={selectedConsultationType}
                    onSuccess={handleConsultationSuccess}
                    onError={handleConsultationError}
                />
            )}
        </div>
    );
});
