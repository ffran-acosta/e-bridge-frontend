'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, Button } from '@/shared';
import { Shield, ArrowLeft } from 'lucide-react';
import { AppHeader } from '@/shared/components/Header';
import { DoctorSidebar } from './Sidebar';
import { AppointmentsCalendar } from '../calendar';
import { ValidatorView } from '../validator/ValidatorView';
import { ExportView } from '../export/ExportView';
import { useAuthStore } from '@/features/auth/store/auth';
import { useDoctorStore } from '@/features/doctor/store/doctorStore';
import { useImpersonationCleanup } from '@/features/doctor/hooks/useImpersonationCleanup';
import { useRouter } from 'next/navigation';

interface DoctorLayoutProps {
    children: React.ReactNode;
    currentView?: 'dashboard' | 'patientProfile' | 'profile';
    onBackClick?: () => void;
}

export function DoctorLayout({
    children,
    currentView = 'dashboard',
    onBackClick
}: DoctorLayoutProps) {
    const { user } = useAuthStore();
    const { isImpersonating, impersonatedDoctorName, clearImpersonation } = useDoctorStore();
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
        if (currentView === 'profile') {
            return 'Mi Perfil';
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
        router.push('/doctor/profile');
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
                    showBackButton={currentView === 'patientProfile' || currentView === 'profile'}
                    onBackClick={currentView === 'profile' ? () => router.push('/doctor/dashboard') : onBackClick}
                    onProfileClick={handleProfileClick}
                />

                <main className="flex-1 overflow-auto p-6">
                    {/* Banner de impersonación */}
                    {isImpersonating && (
                        <div className="mb-6 rounded-lg border border-[#3a3f4a]/40 bg-gradient-to-r from-[#2a2f3a] via-[#3a3f4a] to-[#2a2f3a] p-4 shadow-lg shadow-[#2a2f3a]/30">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                                        <Shield className="size-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white">Modo Administrador</span>
                                        <span className="text-sm text-white/80">
                                            {impersonatedDoctorName 
                                                ? (
                                                    <>
                                                        Estás viendo la vista de <span className="font-bold text-base">{impersonatedDoctorName}</span>
                                                    </>
                                                )
                                                : 'Estás viendo la vista del doctor'
                                            }
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExitImpersonation}
                                    className="bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white"
                                >
                                    <ArrowLeft className="size-4" />
                                    Volver al panel
                                </Button>
                            </div>
                        </div>
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
                    ) : activeSection === 'exportar' ? (
                        <ExportView />
                    ) : (
                        children
                    )}
                    
                </main>
            </div>
        </div>
    );
}