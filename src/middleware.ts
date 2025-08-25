import { NextRequest, NextResponse } from 'next/server';
import { getRedirectPath } from '@/lib/auth-utils';
import type { Role } from '@/types/auth';

// Usar la misma base URL que tu función api
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// Definir qué rutas requieren qué roles
const ROUTE_PERMISSIONS: Record<string, Role[]> = {
    '/super-admin': ['SUPER_ADMIN'],
    '/admin': ['SUPER_ADMIN', 'ADMIN'],
    '/doctor': ['SUPER_ADMIN', 'ADMIN', 'DOCTOR'],
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Si no es una ruta protegida, continuar
    if (!Object.keys(ROUTE_PERMISSIONS).some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Verificar si hay cookies
    const cookies = request.headers.get('cookie');
    if (!cookies) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const apiUrl = `${API_BASE}/auth/me`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                cookie: cookies,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const responseData = await response.json();
        const user = responseData?.data?.data;

        if (!user || !user.role) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verificar permisos por ruta
        const requiredRoles = ROUTE_PERMISSIONS[pathname];

        if (!requiredRoles?.includes(user.role)) {
            const userDashboard = getRedirectPath(user.role);
            return NextResponse.redirect(new URL(userDashboard, request.url));
        }

        return NextResponse.next();

    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/super-admin/:path*', '/admin/:path*', '/doctor/:path*']
};