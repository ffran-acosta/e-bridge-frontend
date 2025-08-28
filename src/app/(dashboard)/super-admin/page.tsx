"use client";

import { useDoctors, useAdmins, useDashboardStats, StatsCard, SearchInput, DoctorCard, AdminCard } from "@/features";
import { AuthGuard } from "@/features/auth";
import { useSearch, Card, CardHeader, CardTitle, CardContent } from "@/shared";
import { Stethoscope, Users, User, Link2, Building2 } from "lucide-react";
import { useState } from "react";

export default function SuperAdminPage() {
    // Search states
    const { search: searchDoctors, setSearch: setSearchDoctors } = useSearch();
    const { search: searchAdmins, setSearch: setSearchAdmins } = useSearch();

    // Selected admin for assignment interface
    const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

    // Data hooks
    const {
        doctors,
        loading: loadingDoctors,
        toggleStatus: toggleDoctorStatus
    } = useDoctors(searchDoctors);

    const {
        admins,
        loading: loadingAdmins,
        toggleStatus: toggleAdminStatus,
        assignDoctor,
        unassignDoctor,
        getAdminName,
        getDoctorName
    } = useAdmins(searchAdmins);

    const {
        stats,
        loading: loadingStats
    } = useDashboardStats();

    const handleToggleAdminSelection = (adminId: string) => {
        setSelectedAdmin(selectedAdmin === adminId ? null : adminId);
    };

    const getAssignedAdminIds = (doctorId: string): string[] => {
        return admins
            .filter(admin => admin.assignedDoctors.includes(doctorId))
            .map(admin => admin.id);
    };

    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN"]}>
            <div className="min-h-screen bg-background p-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-muted-foreground">
                        Gestión completa del sistema médico
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Médicos Activos"
                        value={stats?.activeDoctors ?? 0}
                        icon={Stethoscope}
                        iconColor="text-primary"
                    />
                    <StatsCard
                        title="Administradores Activos"
                        value={stats?.activeAdmins ?? 0}
                        icon={Users}
                        iconColor="text-accent"
                    />
                    <StatsCard
                        title="Total Pacientes"
                        value={stats?.totalPatients ?? 0}
                        icon={User}
                        iconColor="text-green-500"
                    />
                    <StatsCard
                        title="Asignaciones"
                        value={stats?.totalAssignments ?? 0}
                        icon={Link2}
                        iconColor="text-yellow-500"
                    />
                </div>

                {/* Doctors Management Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Stethoscope className="h-5 w-5" />
                            <span>Médicos</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <SearchInput
                                placeholder="Buscar médicos por nombre, especialidad o matrícula..."
                                value={searchDoctors}
                                onChange={setSearchDoctors}
                            />
                        </div>

                        {loadingDoctors ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Cargando médicos...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {doctors.map((doctor) => (
                                    <DoctorCard
                                        key={doctor.id}
                                        doctor={doctor}
                                        onToggleStatus={toggleDoctorStatus}
                                        getAdminName={getAdminName}
                                        showAssignments={true}
                                        assignedAdminIds={getAssignedAdminIds(doctor.id)}
                                    />
                                ))}
                                {doctors.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No se encontraron médicos</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Admins Management Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5" />
                            <span>Asignación de Médicos</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <SearchInput
                                placeholder="Buscar administradores por nombre o email..."
                                value={searchAdmins}
                                onChange={setSearchAdmins}
                            />
                        </div>

                        {loadingAdmins ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Cargando administradores...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {admins.map((admin) => (
                                    <AdminCard
                                        key={admin.id}
                                        admin={admin}
                                        onToggleStatus={toggleAdminStatus}
                                        getDoctorName={getDoctorName}
                                        onAssignDoctor={assignDoctor}
                                        onUnassignDoctor={unassignDoctor}
                                        availableDoctors={doctors}
                                        isSelected={selectedAdmin === admin.id}
                                        onSelect={() => handleToggleAdminSelection(admin.id)}
                                        showAssignmentInterface={true}
                                    />
                                ))}
                                {admins.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No se encontraron administradores</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bottom spacing para mobile */}
                <div className="pb-6"></div>
            </div>
        </AuthGuard>
    );
}