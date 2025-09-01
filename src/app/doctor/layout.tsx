'use client';
import { AuthGuard } from '@/features';
import { DoctorLayout } from '@/features/doctor/components/dashboard/DoctorLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR"]}>
            <DoctorLayout>{children}</DoctorLayout>
        </AuthGuard>
    );
}