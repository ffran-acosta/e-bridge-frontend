'use client';

import React from 'react';
import {
    Menu,
    User,
    LogOut,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/shared'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { useAuthStore } from '@/features';
import { useRouter } from 'next/navigation';

interface AppHeaderProps {
    title: string;
    isMobile?: boolean;
    onMobileMenuClick?: () => void;
    showBackButton?: boolean;
    onBackClick?: () => void;
    onProfileClick?: () => void;
}

export function AppHeader({
    title,
    isMobile = false,
    onMobileMenuClick,
    showBackButton = false,
    onBackClick,
    onProfileClick
}: AppHeaderProps) {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            router.replace('/login');
        }
    };

    const handleProfileClick = () => {
        if (onProfileClick) {
            onProfileClick();
        } else {
            console.log('Profile clicked');
        }
    };

    const getDisplayName = () => {
        if (!user) return 'Usuario';
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }

        return user.firstName || user.email || 'Usuario';
    };
    if (!user) return null;

    return (
        <header className="border-b px-6 py-6 flex items-center justify-between">
            <div className="flex items-center">
                {showBackButton ? (
                    <Button variant="ghost" onClick={onBackClick} className="mr-3">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                ) : isMobile && onMobileMenuClick && (
                    <Button variant="ghost" size="sm" onClick={onMobileMenuClick} className="mr-3">
                        <Menu className="h-5 w-5" />
                    </Button>
                )}
                {/* <h1 className="text-2xl font-semibold">{title}</h1> */}
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                        <UserAvatar
                            firstName={user.firstName || ''}
                            lastName={user.lastName || ''}
                            size="sm"
                            variant="primary"
                        />
                        <span className="hidden sm:block">{getDisplayName()}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}