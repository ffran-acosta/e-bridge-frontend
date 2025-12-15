// app/(dashboard)/layout.tsx
'use client';

import { AuthGuard } from "@/features/auth";
import { AppHeader } from '@/shared/components/Header';
import { useAuthStore } from '@/features/auth/store/auth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuthStore();
    const router = useRouter();

    const handleProfileClick = () => {
        // Para admin, podría ir a un perfil de admin en el futuro
        // Por ahora, no hacer nada o mostrar mensaje
        console.log('Perfil de admin - funcionalidad pendiente');
    };

    return (
        <AuthGuard>
            <div className="min-h-screen flex flex-col">
                {user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role) && (
                    <AppHeader
                        title={user.role === 'SUPER_ADMIN' ? 'Panel de Administración' : 'Dashboard Admin'}
                        onProfileClick={handleProfileClick}
                    />
                )}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </AuthGuard>
    );
}
