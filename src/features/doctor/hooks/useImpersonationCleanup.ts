"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDoctorStore } from '../store/doctorStore';

/**
 * Hook que limpia la impersonación cuando el usuario navega fuera del contexto del doctor
 */
export function useImpersonationCleanup() {
    const pathname = usePathname();
    const { clearImpersonation, isImpersonating } = useDoctorStore();

    useEffect(() => {
        // Si estamos impersonando y navegamos fuera de /doctor/*, limpiar la impersonación
        if (isImpersonating && !pathname.startsWith('/doctor')) {
            clearImpersonation();
        }
    }, [pathname, isImpersonating, clearImpersonation]);
}
