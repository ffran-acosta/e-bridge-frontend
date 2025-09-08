// app/(dashboard)/layout.tsx
'use client';

import { AuthGuard } from "@/features/auth";
import { AppHeader } from '@/shared/components/Header';
import { useAuthStore } from '@/features/auth/store/auth';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuthStore();

    return (
        <AuthGuard>
            <div className="min-h-screen flex flex-col">
                {user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role) && (
                    <AppHeader
                        title={user.role === 'SUPER_ADMIN' ? 'Panel de Administración' : 'Dashboard Admin'}
                    />
                )}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </AuthGuard>
    );
}
