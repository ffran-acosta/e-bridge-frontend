"use client";

import { AuthGuard } from "@/features";

export default function DoctorPage() {
    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR"]}>
            <div>DASHBOARD - DOCTOR</div>
        </AuthGuard>
    );
}