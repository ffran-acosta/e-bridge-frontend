import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import type { Doctor } from "@/types/dashboard";

interface DoctorCardAdminProps {
    doctor: Doctor;
    onViewProfile: (doctorId: string) => void;
}

export function DoctorCardAdmin({
    doctor,
    onViewProfile
}: DoctorCardAdminProps) {
    return (
        <div className="p-4 rounded-lg border transition-all border-border bg-card">
            <div className="flex items-start space-x-4">
                <UserAvatar
                    firstName={doctor.firstName}
                    lastName={doctor.lastName}
                    variant="primary"
                />

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {doctor.specialty.name} • {doctor.licenseNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {doctor.email}
                            </p>
                        </div>

                        <Button
                            onClick={() => onViewProfile(doctor.id)}
                            size="sm"
                            className="shrink-0"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver perfil
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Badge
                            variant={doctor.isActive ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {doctor.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}