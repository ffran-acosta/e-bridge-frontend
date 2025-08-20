'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Stethoscope, Users, ChevronRight } from 'lucide-react';

// Datos hardcodeados para la demo
const doctorsData = [
    {
        id: '1',
        firstName: 'María',
        lastName: 'González',
        specialty: 'Cardiología',
        licenseNumber: 'MP-12345',
        patientsCount: 24,
        isActive: true,
        avatar: 'MG'
    },
    {
        id: '2',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        specialty: 'Pediatría',
        licenseNumber: 'MP-67890',
        patientsCount: 18,
        isActive: true,
        avatar: 'CR'
    },
    {
        id: '3',
        firstName: 'Ana',
        lastName: 'Martínez',
        specialty: 'Dermatología',
        licenseNumber: 'MP-54321',
        patientsCount: 31,
        isActive: true,
        avatar: 'AM'
    },
    {
        id: '4',
        firstName: 'Roberto',
        lastName: 'Silva',
        specialty: 'Traumatología',
        licenseNumber: 'MP-98765',
        patientsCount: 15,
        isActive: false,
        avatar: 'RS'
    },
    {
        id: '5',
        firstName: 'Laura',
        lastName: 'Fernández',
        specialty: 'Ginecología',
        licenseNumber: 'MP-13579',
        patientsCount: 27,
        isActive: true,
        avatar: 'LF'
    }
];

const AdminDashboard = () => {
    const handleDoctorClick = (doctorId: string) => {
        // Navegación a la lista de pacientes del médico
        window.location.href = `/dashboard/admin/doctors/${doctorId}/patients`;
    };

    return (
        <div className="min-h-screen bg-background p-4 theme-ebridge-dark">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    Panel de Gestión
                </h1>
                <p className="text-muted-foreground">
                    Médicos asignados a tu gestión
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Médicos Activos</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {doctorsData.filter(d => d.isActive).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {doctorsData.reduce((acc, d) => acc + d.patientsCount, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Doctors List */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                    Médicos Asignados
                </h2>

                {doctorsData.map((doctor) => (
                    <Card
                        key={doctor.id}
                        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${!doctor.isActive ? 'opacity-60' : ''
                            }`}
                        onClick={() => handleDoctorClick(doctor.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold text-sm">
                                            {doctor.avatar}
                                        </span>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg font-semibold text-foreground truncate">
                                                Dr. {doctor.firstName} {doctor.lastName}
                                            </h3>
                                            {!doctor.isActive && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Inactivo
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center">
                                                <Stethoscope className="h-4 w-4 mr-1" />
                                                {doctor.specialty}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70">
                                                MP: {doctor.licenseNumber}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Patient Count & Arrow */}
                                    <div className="flex items-center space-x-3">
                                        <div className="text-center">
                                            <div className="flex items-center space-x-1">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-semibold text-foreground">
                                                    {doctor.patientsCount}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">pacientes</p>
                                        </div>

                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Bottom spacing for mobile */}
            <div className="pb-6"></div>
        </div>
    );
};

export default AdminDashboard;