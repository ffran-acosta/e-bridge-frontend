// features/doctor/components/dashboard/DoctorSidebar.tsx
'use client';

import React from 'react';
import {
    Users,
    Calendar,
    FileCheck,
    Download
} from 'lucide-react';
import { Button } from '@/shared';

interface DoctorSidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    user: {
        firstName: string;
        lastName: string;
        role: string;
    };
}

export function DoctorSidebar({
    activeSection,
    setActiveSection,
    user
}: DoctorSidebarProps) {
    const menuItems = [
        { id: 'pacientes', label: 'Pacientes', icon: Users, active: true },
        { id: 'turnos', label: 'Turnos', icon: Calendar, active: false },
        { id: 'validador', label: 'Validador', icon: FileCheck, active: false },
        { id: 'exportar', label: 'Exportar', icon: Download, active: false }
    ];

    const displayName = `${user.firstName} ${user.lastName}`;

    return (
        <div className="flex flex-col h-full border-r">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Dr. {displayName}</h2>
                <p className="text-sm text-muted-foreground">Dashboard Médico</p>
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <Button
                                variant={activeSection === item.id ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => item.active && setActiveSection(item.id)}
                                disabled={!item.active}
                            >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.label}
                                {!item.active && <span className="ml-auto text-xs text-muted-foreground">(Próximamente)</span>}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}