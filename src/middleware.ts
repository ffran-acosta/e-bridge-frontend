// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/super-admin', '/admin', '/doctor', '/dashboard'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAccessToken = request.cookies.has('accessToken');
    const hasRefreshToken = request.cookies.has('refreshToken');

    const isAuthenticated = hasAccessToken || hasRefreshToken;

    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (PUBLIC_ROUTES.includes(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname === '/' && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};