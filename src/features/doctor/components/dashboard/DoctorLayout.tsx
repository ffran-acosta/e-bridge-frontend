'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent } from '@/shared';
import { AppHeader } from '@/shared/components/Header';
import { DoctorSidebar } from './Sidebar';

interface DoctorLayoutProps {
    children: React.ReactNode;
    doctorName?: string;
    currentView?: 'dashboard' | 'patientProfile';
    onBackClick?: () => void;
    onLogout?: () => void;
    onProfileClick?: () => void;
}

export function DoctorLayout({
    children,
    doctorName = 'juan-perez',
    currentView = 'dashboard',
    onBackClick,
    onLogout,
    onProfileClick
}: DoctorLayoutProps) {
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

    const getUserDisplayName = () => {
        const displayName = doctorName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `Dr. ${displayName}`;
    };

    return (
        <div className="h-screen flex">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="w-64 flex-shrink-0">
                    <DoctorSidebar
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        doctorName={doctorName}
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
                            doctorName={doctorName}
                        />
                    </SheetContent>
                </Sheet>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <AppHeader
                    title={getSectionTitle()}
                    userDisplayName={getUserDisplayName()}
                    userRole="DOCTOR"
                    isMobile={isMobile}
                    onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
                    showBackButton={currentView === 'patientProfile'}
                    onBackClick={onBackClick}
                    onLogout={onLogout}
                    onProfileClick={onProfileClick}
                />

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}