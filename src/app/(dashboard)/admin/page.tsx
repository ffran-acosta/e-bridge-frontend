"use client";

import { useAdminDoctors, StatsCard, SearchInput, DoctorCardAdmin } from "@/features";
import { AuthGuard } from "@/features/auth";
import { useSearch, Card, CardHeader, CardTitle, CardContent } from "@/shared";
import { Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDoctorStore } from "@/features/doctor/store/doctorStore";

export default function AdminPage() {
    const router = useRouter();

    // Search state
    const { search: searchDoctors, setSearch: setSearchDoctors } = useSearch();

    // Data hook
    const { doctors, loading, error, totalDoctors } = useAdminDoctors(searchDoctors);

    // Doctor store para impersonación
    const { setImpersonatedDoctor } = useDoctorStore();

    const handleViewProfile = (doctorId: string) => {
        // Configurar impersonación y navegar al dashboard del doctor
        setImpersonatedDoctor(doctorId);
        router.push('/doctor/dashboard');
    };

    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
            <div className="min-h-screen bg-background p-4">

                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <StatsCard
                        title="Total Médicos"
                        value={totalDoctors}
                        icon={Stethoscope}
                        iconColor="text-primary"
                    />
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