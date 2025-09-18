// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/super-admin', '/admin', '/doctor', '/dashboard'];

// Función para validar si las cookies son válidas
async function validateAuthCookies(request: NextRequest): Promise<boolean> {
    const hasAccessToken = request.cookies.has('accessToken');
    const hasRefreshToken = request.cookies.has('refreshToken');
    
    if (!hasAccessToken && !hasRefreshToken) {
        return false;
    }

    try {
        // Hacer una petición rápida para validar las cookies
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/auth/me`, {
            method: 'GET',
            headers: {
                'Cookie': request.headers.get('cookie') || '',
            },
        });

        return response.ok;
    } catch (error) {
        console.log('Error validando cookies:', error);
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAccessToken = request.cookies.has('accessToken');
    const hasRefreshToken = request.cookies.has('refreshToken');

    // Log para debugging
    console.log(`Middleware: ${pathname} - Cookies: accessToken=${hasAccessToken}, refreshToken=${hasRefreshToken}`);

    // Si no hay cookies, permitir acceso a rutas públicas
    if (!hasAccessToken && !hasRefreshToken) {
        if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
            console.log(`Middleware: No hay cookies, redirigiendo a login desde ${pathname}`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    // Si hay cookies, validarlas
    const isValidAuth = await validateAuthCookies(request);
    
    if (!isValidAuth) {
        // Si las cookies son inválidas, limpiarlas y redirigir
        console.log(`Middleware: Cookies inválidas, limpiando y redirigiendo a login`);
        const response = NextResponse.redirect(new URL('/login', request.url));
        
        // Limpiar cookies
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        
        return response;
    }

    // Si las cookies son válidas, aplicar lógica de redirección normal
    if (PUBLIC_ROUTES.includes(pathname)) {
        console.log(`Middleware: Usuario autenticado, redirigiendo a dashboard desde ${pathname}`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname === '/') {
        console.log(`Middleware: Usuario autenticado, redirigiendo a dashboard desde raíz`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};