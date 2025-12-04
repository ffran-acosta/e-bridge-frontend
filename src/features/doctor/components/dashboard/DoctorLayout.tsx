'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, Alert } from '@/shared';
import { AppHeader } from '@/shared/components/Header';
import { DoctorSidebar } from './Sidebar';
import { AppointmentsCalendar } from '../calendar';
import { ValidatorView } from '../validator/ValidatorView';
import { useAuthStore } from '@/features/auth/store/auth';
import { useDoctorStore } from '@/features/doctor/store/doctorStore';
import { useImpersonationCleanup } from '@/features/doctor/hooks/useImpersonationCleanup';
import { useRouter } from 'next/navigation';

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
    const { user } = useAuthStore();
    const { isImpersonating, clearImpersonation } = useDoctorStore();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('pacientes');
    
    // Restaurar la sección activa desde sessionStorage cuando se monta el dashboard
    React.useEffect(() => {
        if (currentView === 'dashboard') {
            const savedSection = sessionStorage.getItem('doctorActiveSection');
            if (savedSection) {
                setActiveSection(savedSection);
                sessionStorage.removeItem('doctorActiveSection');
            }
        }
    }, [currentView]);

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Limpiar impersonación cuando se navega fuera del contexto del doctor
    useImpersonationCleanup();

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
        // TODO: Implementar navegación al perfil del doctor
    };

    const handleExitImpersonation = () => {
        clearImpersonation();
        router.push('/admin');
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
                        setActiveSection={(section) => {
                            // Si estamos en el perfil del paciente y cambiamos de sección, navegar al dashboard
                            if (currentView === 'patientProfile' && section !== 'pacientes') {
                                // Guardar la sección en sessionStorage para mantenerla después de navegar
                                sessionStorage.setItem('doctorActiveSection', section);
                                router.push('/doctor/dashboard');
                            } else {
                                setActiveSection(section);
                            }
                        }}
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
                                // Si estamos en el perfil del paciente y cambiamos de sección, navegar al dashboard
                                if (currentView === 'patientProfile' && section !== 'pacientes') {
                                    // Guardar la sección en sessionStorage para mantenerla después de navegar
                                    sessionStorage.setItem('doctorActiveSection', section);
                                    router.push('/doctor/dashboard');
                                } else {
                                    setActiveSection(section);
                                }
                                setIsMobileSidebarOpen(false);
                            }}
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
                    {/* Banner de impersonación */}
                    {isImpersonating && (
                        <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">Modo Administrador</span>
                                    <span className="text-sm">Estás viendo la vista del doctor</span>
                                </div>
                                <button
                                    onClick={handleExitImpersonation}
                                    className="text-sm underline hover:no-underline"
                                >
                                    Volver al panel de administración
                                </button>
                            </div>
                        </Alert>
                    )}
                    
                    {/* Mostrar contenido según la sección activa */}
                    {currentView === 'patientProfile' ? (
                        children
                    ) : activeSection === 'turnos' ? (
                        <div className="max-w-4xl mx-auto">
                            <AppointmentsCalendar />
                        </div>
                    ) : activeSection === 'validador' ? (
                        <div className="max-w-4xl mx-auto">
                            <ValidatorView />
                        </div>
                    ) : (
                        children
                    )}
                    
                </main>
            </div>
        </div>
    );
}