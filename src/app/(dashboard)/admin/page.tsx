"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Stethoscope } from 'lucide-react';

// Componentes reutilizables
import { SearchInput } from '@/components/dashboard/SearchInput';
import { DoctorCardAdmin } from '@/components/dashboard/DoctorCardAdmin';
import { StatsCard } from '@/components/dashboard/StatsCard';

// Hooks
import { useAdminDoctors } from '@/hooks/useAdminDoctors';
import { useSearch } from '@/hooks/useSearch';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    // Search state
    const { search: searchDoctors, setSearch: setSearchDoctors } = useSearch();

    // Data hook
    const {
        doctors,
        loading,
        error,
        totalDoctors
    } = useAdminDoctors(searchDoctors);

    const handleViewProfile = (doctorId: string) => {
        router.push(`/doctor/${doctorId}`);
    };

    const activeDoctors = doctors.filter(d => d.isActive).length;

    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <div className="min-h-screen bg-background p-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-muted-foreground">
                        Gestión de médicos asignados
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <StatsCard
                        title="Total Médicos"
                        value={totalDoctors}
                        icon={Stethoscope}
                        iconColor="text-primary"
                    />
                    {/* <StatsCard
                        title="Médicos Activos"
                        value={activeDoctors}
                        icon={Stethoscope}
                        iconColor="text-green-500"
                    /> */}
                    {/* <StatsCard
                        title="Médicos Inactivos"
                        value={totalDoctors - activeDoctors}
                        icon={Stethoscope}
                        iconColor="text-gray-500"
                    /> */}
                </div>

                {/* Doctors Management Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Stethoscope className="h-5 w-5" />
                            <span>Médicos Asignados</span>
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

                        {error && (
                            <div className="text-center py-8">
                                <p className="text-destructive">{error}</p>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Cargando médicos...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {doctors.map((doctor) => (
                                    <DoctorCardAdmin
                                        key={doctor.id}
                                        doctor={doctor}
                                        onViewProfile={handleViewProfile}
                                    />
                                ))}
                                {doctors.length === 0 && !loading && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            {searchDoctors ? 'No se encontraron médicos' : 'No tienes médicos asignados'}
                                        </p>
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