// features/doctor/components/dashboard/DoctorSidebar.tsx
'use client';

import React from 'react';
import {
    Users,
    Calendar,
    FileCheck,
    Download
} from 'lucide-react';
import { Button, GlowContainer } from '@/shared';

interface DoctorSidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export function DoctorSidebar({
    activeSection,
    setActiveSection,
}: DoctorSidebarProps) {
    const menuItems = [
        { id: 'pacientes', label: 'Pacientes', icon: Users, active: true },
        { id: 'turnos', label: 'Turnos', icon: Calendar, active: true },
        { id: 'validador', label: 'Validador', icon: FileCheck, active: true },
        { id: 'exportar', label: 'Exportar', icon: Download, active: true }
    ];

    return (
        <div className="flex flex-col h-full border-r">
            <div className="p-6 border-b">
                <h2 className="text-3xl font-semibold">e-Bridge</h2>
                {/* <p className="text-sm text-muted-foreground">Dashboard Médico</p> */}
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <GlowContainer
                                glowColor={activeSection === item.id ? "rgba(42, 47, 58, 0.5)" : "rgba(69, 151, 128, 0.6)"}
                                glowSize={120}
                                className="rounded-sm"
                            >
                                <Button
                                    variant={activeSection === item.id ? "default" : "ghost"}
                                    className="w-full justify-start relative"
                                    onClick={() => {
                                        if (item.active) {
                                            setActiveSection(item.id);
                                        }
                                    }}
                                    disabled={!item.active}
                                >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.label}
                                    {!item.active && <span className="ml-auto text-xs text-muted-foreground">(Próximamente)</span>}
                                </Button>
                            </GlowContainer>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}