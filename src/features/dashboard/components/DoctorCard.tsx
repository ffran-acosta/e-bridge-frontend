"use client";

import { Doctor } from "../types/dashboard";
import { BaseUserCard } from "@/shared/components/cards/BaseUserCard";
import { mapDoctorToUserDisplay, mapAssignmentsToBadges } from "@/shared/utils/userMappers";

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
    // Mapeo de datos usando utilidades
    const userData = {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        isActive: doctor.isActive
    };

    const display = mapDoctorToUserDisplay(doctor, patientsCount);

    const actions = {
        onToggleStatus: () => onToggleStatus(doctor.id)
    };

    const badges = showAssignments && getAdminName
        ? mapAssignmentsToBadges(assignedAdminIds, getAdminName)
        : [];

    const config = {
        showStatusToggle: true,
        showAssignments,
        avatarVariant: "primary" as const
    };

    return (
        <BaseUserCard
            user={userData}
            display={display}
            actions={actions}
            badges={badges}
            config={config}
        />
    );
}