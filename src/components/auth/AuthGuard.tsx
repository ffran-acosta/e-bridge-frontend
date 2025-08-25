"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { getRedirectPath } from '@/lib/auth-utils';
import type { Role } from '@/types/auth';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    fallback?: React.ReactNode;
}

export function AuthGuard({
    children,
    allowedRoles,
    fallback = <div>Cargando...</div>
}: AuthGuardProps) {
    const router = useRouter();
    const { user, loading, isInitialized, initialize } = useAuthStore();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (!isInitialized) {
                await initialize();
            }
            setIsCheckingAuth(false);
        };

        checkAuth();
    }, [isInitialized, initialize]);

    useEffect(() => {
        if (!isCheckingAuth && !loading) {
            // Si no hay usuario, redirect a login
            if (!user) {
                router.push('/login');
                return;
            }

            // Si hay roles específicos requeridos, verificar
            if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Redirect a su dashboard correspondiente
                const userDashboard = getRedirectPath(user.role);
                router.push(userDashboard);
                return;
            }
        }
    }, [user, loading, isCheckingAuth, allowedRoles, router]);

    // Mostrar loading mientras verifica autenticación
    if (isCheckingAuth || loading) {
        return fallback;
    }

    // Si no hay usuario, no mostrar nada (ya se redirigió)
    if (!user) {
        return null;
    }

    // Si hay roles requeridos y no los tiene, no mostrar nada
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}