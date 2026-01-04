"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth';
import { getRedirectPath } from '../lib/redirects';

export const useAuthRedirect = () => {
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user && user.role) {
            const redirectPath = getRedirectPath(user.role);
            router.push(redirectPath);
        } else {
        }
    }, [user, router]);
};




