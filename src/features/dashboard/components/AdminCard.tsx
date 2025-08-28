"use client";
import { Button, Badge } from "@/shared";
import { Unlink, Plus } from "lucide-react";
import { Admin, Doctor } from "../types/dashboard";
import { StatusToggleButton } from "./StatusToggleButton";
import { UserAvatar } from "./UserAvatar";

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
    return (
        <div
            className={`p-4 rounded-lg border transition-all cursor-pointer ${isSelected
                    ? 'border-primary bg-primary/10'
                    : admin.isActive
                        ? 'border-border bg-card hover:bg-accent/50'
                        : 'border-border bg-muted/50 opacity-75'
                }`}
            onClick={onSelect}
        >
            <div className="flex items-start space-x-4">
                <UserAvatar
                    firstName={admin.firstName}
                    lastName={admin.lastName}
                    variant="accent"
                />

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {admin.firstName} {admin.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {admin.email}
                            </p>
                        </div>

                        <StatusToggleButton
                            isActive={admin.isActive}
                            onToggle={() => onToggleStatus(admin.id)}
                            stopPropagation={true}
                        />
                    </div>

                    {/* Assigned Doctors */}
                    {admin.assignedDoctors && (
                        <div className="mb-3">
                            <span className="text-sm text-muted-foreground">
                                Gestiona {admin.assignedDoctors.length} médicos:
                            </span>
                            {admin.assignedDoctors.length === 0 ? (
                                <Badge variant="outline" className="ml-2 text-muted-foreground">
                                    Sin médicos asignados
                                </Badge>
                            ) : (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {admin.assignedDoctors.map((doctorId) => (
                                        <Badge
                                            key={doctorId}
                                            variant="secondary"
                                            className="text-xs flex items-center space-x-1"
                                        >
                                            <span>
                                                {getDoctorName ? getDoctorName(doctorId) : doctorId}
                                            </span>
                                            {onUnassignDoctor && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUnassignDoctor(doctorId, admin.id);
                                                    }}
                                                    className="ml-1 hover:text-red-400"
                                                >
                                                    <Unlink className="h-3 w-3" />
                                                </button>
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

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
            </div>
        </div>
    );
}