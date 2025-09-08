"use client";
import { Button, Badge } from "@/shared";
import { Unlink, Plus } from "lucide-react";
import { Admin, Doctor } from "../types/dashboard";
import { UserCard } from "@/shared/components";

interface AdminCardProps {
    admin: Admin;
    onToggleStatus: (adminId: string) => void;
    getDoctorName?: (doctorId: string) => string;
    onUnassignDoctor?: (doctorId: string, adminId: string) => void;
    onAssignDoctor?: (doctorId: string, adminId: string) => void;
    availableDoctors?: Doctor[];
    isSelected?: boolean;
    onSelect?: () => void;
    showAssignmentInterface?: boolean;
}

export function AdminCard({
    admin,
    onToggleStatus,
    getDoctorName,
    onUnassignDoctor,
    onAssignDoctor,
    availableDoctors = [],
    isSelected = false,
    onSelect,
    showAssignmentInterface = true
}: AdminCardProps) {
    const badges = admin.assignedDoctors?.map(doctorId => ({
        id: doctorId,
        label: getDoctorName ? getDoctorName(doctorId) : doctorId,
        variant: "secondary" as const,
        onRemove: onUnassignDoctor ? (id: string) => onUnassignDoctor(id, admin.id) : undefined
    })) || [];

    return (
        <div className="space-y-4">
            <UserCard
                firstName={admin.firstName}
                lastName={admin.lastName}
                email={admin.email}
                isActive={admin.isActive}
                badges={badges}
                onToggleStatus={() => onToggleStatus(admin.id)}
                onSelect={onSelect}
                isSelected={isSelected}
                showStatusToggle={true}
                showAssignments={true}
                avatarVariant="accent"
            />

            {/* Assignment Interface */}
            {isSelected && showAssignmentInterface && onAssignDoctor && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">
                        Asignar médicos disponibles:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {availableDoctors
                            .filter(doctor =>
                                doctor.isActive &&
                                admin.assignedDoctors &&
                                !admin.assignedDoctors.includes(doctor.id)
                            )
                            .map((doctor) => (
                                <Button
                                    key={doctor.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAssignDoctor(doctor.id, admin.id);
                                    }}
                                    className="text-xs"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </Button>
                            ))}
                        {availableDoctors.filter(d =>
                            d.isActive &&
                            admin.assignedDoctors &&
                            !admin.assignedDoctors.includes(d.id)
                        ).length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Todos los médicos activos ya están asignados
                                </p>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}