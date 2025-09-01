'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent } from '@/shared';
import { AppHeader } from '@/shared/components/Header';
import { DoctorSidebar } from './Sidebar';
import { useAuthStore } from '@/features/auth/store/auth';

interface DoctorLayoutProps {
    children: React.ReactNode;
    currentView?: 'dashboard' | 'patientProfile';
    onBackClick?: () => void;
}

export function DoctorLayout({
    children,
    currentView = 'dashboard',
    onBackClick
}: DoctorLayoutProps) {
    const { user, logout } = useAuthStore();
    const [activeSection, setActiveSection] = useState('pacientes');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar mobile
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getSectionTitle = () => {
        if (currentView === 'patientProfile') {
            return 'Perfil del Paciente';
        }
        const titles = {
            'pacientes': 'Pacientes',
            'turnos': 'Turnos',
            'validador': 'Validador',
            'exportar': 'Exportar'
        };
        return titles[activeSection as keyof typeof titles] || 'Dashboard';
    };

    const handleProfileClick = () => {
        console.log('Navigate to doctor profile');
    };

    // Early return si no hay usuario
    if (!user || !['DOCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="w-64 flex-shrink-0">
                    <DoctorSidebar
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        user={user}
                    />
                </div>
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
                <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-64">
                        <DoctorSidebar
                            activeSection={activeSection}
                            setActiveSection={(section) => {
                                setActiveSection(section);
                                setIsMobileSidebarOpen(false);
                            }}
                            user={user}
                        />
                    </SheetContent>
                </Sheet>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <AppHeader
                    title={getSectionTitle()}
                    isMobile={isMobile}
                    onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
                    showBackButton={currentView === 'patientProfile'}
                    onBackClick={onBackClick}
                    onProfileClick={handleProfileClick}
                />

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}