"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
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