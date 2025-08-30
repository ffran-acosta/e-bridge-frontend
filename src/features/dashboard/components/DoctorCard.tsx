"use client";

import { Doctor } from "../types/dashboard";
import { StatusToggleButton } from "./StatusToggleButton";
import { UserAvatar } from "@/shared/components";
import { Badge } from "@/shared";

interface DoctorCardProps {
    doctor: Doctor;
    onToggleStatus: (doctorId: string) => void;
    getAdminName?: (adminId: string) => string;
    showAssignments?: boolean;
    assignedAdminIds?: string[];
    patientsCount?: number;
}

export function DoctorCard({
    doctor,
    onToggleStatus,
    getAdminName,
    showAssignments = true,
    assignedAdminIds = [],
    patientsCount
}: DoctorCardProps) {
    return (
        <div
            className={`p-4 rounded-lg border transition-all ${doctor.isActive
                    ? 'border-border bg-card'
                    : 'border-border bg-muted/50 opacity-75'
                }`}
        >
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
                                {patientsCount !== undefined && ` • ${patientsCount} pacientes`}
                            </p>
                        </div>

                        <StatusToggleButton
                            isActive={doctor.isActive}
                            onToggle={() => onToggleStatus(doctor.id)}
                        />
                    </div>

                    {showAssignments && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Asignado a:</span>
                            {assignedAdminIds.length === 0 ? (
                                <Badge variant="outline" className="text-muted-foreground">
                                    Sin asignar
                                </Badge>
                            ) : (
                                <div className="flex flex-wrap gap-1">
                                    {assignedAdminIds.map((adminId) => (
                                        <Badge key={adminId} variant="secondary" className="text-xs">
                                            {getAdminName ? getAdminName(adminId) : adminId}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}