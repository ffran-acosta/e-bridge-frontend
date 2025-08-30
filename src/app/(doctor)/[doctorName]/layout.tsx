'use client';

import { DoctorLayout } from '@/features/doctor/components/dashboard/DoctorLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DoctorLayout>{children}</DoctorLayout>;
}