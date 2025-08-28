"use client";

import { useAuthStore } from '@/features';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <>
            {children}
            <Toaster position="top-right" />
        </>
    );
}