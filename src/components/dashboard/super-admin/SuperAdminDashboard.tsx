'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    User,
    Stethoscope,
    Users,
    Settings,
    Plus,
    UserCheck,
    UserX,
    Link2,
    Unlink,
    Shield,
    Building2
} from 'lucide-react';

// Datos hardcodeados para la demo
const doctorsData = [
    {
        id: '1',
        firstName: 'María',
        lastName: 'González',
        specialty: 'Cardiología',
        licenseNumber: 'MP-12345',
        email: 'maria.gonzalez@hospital.com',
        patientsCount: 24,
        isActive: true,
        assignedAdmins: ['admin1', 'admin2']
    },
    {
        id: '2',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        specialty: 'Pediatría',
        licenseNumber: 'MP-67890',
        email: 'carlos.rodriguez@hospital.com',
        patientsCount: 18,
        isActive: true,
        assignedAdmins: ['admin1']
    },
    {
        id: '3',
        firstName: 'Ana',
        lastName: 'Martínez',
        specialty: 'Dermatología',
        licenseNumber: 'MP-54321',
        email: 'ana.martinez@hospital.com',
        patientsCount: 31,
        isActive: false,
        assignedAdmins: []
    },
    {
        id: '4',
        firstName: 'Roberto',
        lastName: 'Silva',
        specialty: 'Traumatología',
        licenseNumber: 'MP-98765',
        email: 'roberto.silva@hospital.com',
        patientsCount: 15,
        isActive: true,
        assignedAdmins: ['admin2']
    },
    {
        id: '5',
        firstName: 'Laura',
        lastName: 'Fernández',
        specialty: 'Ginecología',
        licenseNumber: 'MP-13579',
        email: 'laura.fernandez@hospital.com',
        patientsCount: 27,
        isActive: true,
        assignedAdmins: ['admin3']
    }
];

const adminsData = [
    {
        id: 'admin1',
        firstName: 'Patricia',
        lastName: 'López',
        email: 'patricia.lopez@hospital.com',
        assignedDoctors: ['1', '2'],
        isActive: true
    },
    {
        id: 'admin2',
        firstName: 'Ricardo',
        lastName: 'Morales',
        email: 'ricardo.morales@hospital.com',
        assignedDoctors: ['1', '4'],
        isActive: true
    },
    {
        id: 'admin3',
        firstName: 'Carmen',
        lastName: 'Ruiz',
        email: 'carmen.ruiz@hospital.com',
        assignedDoctors: ['5'],
        isActive: true
    },
    {
        id: 'admin4',
        firstName: 'Miguel',
        lastName: 'Torres',
        email: 'miguel.torres@hospital.com',
        assignedDoctors: [],
        isActive: false
    }
];

const SuperAdminDashboard = () => {
    const [searchDoctors, setSearchDoctors] = useState('');
    const [searchAdmins, setSearchAdmins] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

    const filteredDoctors = doctorsData.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchDoctors.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchDoctors.toLowerCase()) ||
        doctor.licenseNumber.toLowerCase().includes(searchDoctors.toLowerCase())
    );

    const filteredAdmins = adminsData.filter(admin =>
        `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchAdmins.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchAdmins.toLowerCase())
    );

    const toggleDoctorStatus = (doctorId: string) => {
        console.log(`Toggle status for doctor: ${doctorId}`);
        // Aquí irá la lógica para activar/desactivar médico
        alert(`Toggle status para Dr. ${doctorsData.find(d => d.id === doctorId)?.firstName}`);
    };

    const toggleAdminStatus = (adminId: string) => {
        console.log(`Toggle status for admin: ${adminId}`);
        // Aquí irá la lógica para activar/desactivar admin
        alert(`Toggle status para ${adminsData.find(a => a.id === adminId)?.firstName}`);
    };

    const handleAssignDoctor = (doctorId: string, adminId: string) => {
        console.log(`Assign doctor ${doctorId} to admin ${adminId}`);
        // Aquí irá la lógica de asignación
        alert(`Asignar Dr. ${doctorsData.find(d => d.id === doctorId)?.firstName} a ${adminsData.find(a => a.id === adminId)?.firstName}`);
    };

    const handleUnassignDoctor = (doctorId: string, adminId: string) => {
        console.log(`Unassign doctor ${doctorId} from admin ${adminId}`);
        // Aquí irá la lógica de desasignación
        alert(`Desasignar Dr. ${doctorsData.find(d => d.id === doctorId)?.firstName} de ${adminsData.find(a => a.id === adminId)?.firstName}`);
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getAdminName = (adminId: string) => {
        const admin = adminsData.find(a => a.id === adminId);
        return admin ? `${admin.firstName} ${admin.lastName}` : 'Admin no encontrado';
    };

    return (
        <div className="min-h-screen bg-background p-4 theme-ebridge-dark">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    Panel de Administración
                </h1>
                <p className="text-muted-foreground">
                    Gestión completa del sistema médico
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Stethoscope className="h-5 w-5 text-primary" />
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
                            <Users className="h-5 w-5 text-accent" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {adminsData.filter(a => a.isActive).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Pacientes</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {doctorsData.reduce((acc, d) => acc + d.patientsCount, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Link2 className="h-5 w-5 text-yellow-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Asignaciones</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {doctorsData.reduce((acc, d) => acc + d.assignedAdmins.length, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Doctors Management Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Stethoscope className="h-5 w-5" />
                        <span>Gestión de Médicos</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar médicos por nombre, especialidad o matrícula..."
                                value={searchDoctors}
                                onChange={(e) => setSearchDoctors(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className={`p-4 rounded-lg border transition-all ${doctor.isActive
                                        ? 'border-border bg-card'
                                        : 'border-border bg-muted/50 opacity-75'
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-primary font-semibold text-sm">
                                            {getInitials(doctor.firstName, doctor.lastName)}
                                        </span>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    Dr. {doctor.firstName} {doctor.lastName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {doctor.specialty} • {doctor.licenseNumber}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {doctor.email} • {doctor.patientsCount} pacientes
                                                </p>
                                            </div>

                                            {/* Toggle Button */}
                                            <Button
                                                variant={doctor.isActive ? "destructive" : "default"}
                                                size="sm"
                                                onClick={() => toggleDoctorStatus(doctor.id)}
                                                className="shrink-0"
                                            >
                                                {doctor.isActive ? (
                                                    <>
                                                        <UserX className="h-4 w-4 mr-2" />
                                                        Desactivar
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="h-4 w-4 mr-2" />
                                                        Activar
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Assigned Admins */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-muted-foreground">Asignado a:</span>
                                            {doctor.assignedAdmins.length === 0 ? (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    Sin asignar
                                                </Badge>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {doctor.assignedAdmins.map((adminId) => (
                                                        <Badge key={adminId} variant="secondary" className="text-xs">
                                                            {getAdminName(adminId)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Admins Management Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Asignacion de Medicos</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar secretarias por nombre o email..."
                                value={searchAdmins}
                                onChange={(e) => setSearchAdmins(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredAdmins.map((admin) => (
                            <div
                                key={admin.id}
                                className={`p-4 rounded-lg border transition-all cursor-pointer ${selectedAdmin === admin.id
                                        ? 'border-primary bg-primary/10'
                                        : admin.isActive
                                            ? 'border-border bg-card hover:bg-accent/50'
                                            : 'border-border bg-muted/50 opacity-75'
                                    }`}
                                onClick={() => setSelectedAdmin(selectedAdmin === admin.id ? null : admin.id)}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-accent font-semibold text-sm">
                                            {getInitials(admin.firstName, admin.lastName)}
                                        </span>
                                    </div>

                                    {/* Admin Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {admin.firstName} {admin.lastName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {admin.email}
                                                </p>
                                            </div>

                                            {/* Toggle Button */}
                                            <Button
                                                variant={admin.isActive ? "destructive" : "default"}
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleAdminStatus(admin.id);
                                                }}
                                                className="shrink-0"
                                            >
                                                {admin.isActive ? (
                                                    <>
                                                        <UserX className="h-4 w-4 mr-2" />
                                                        Desactivar
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="h-4 w-4 mr-2" />
                                                        Activar
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Assigned Doctors */}
                                        <div className="mb-3">
                                            <span className="text-sm text-muted-foreground">
                                                Gestiona {admin.assignedDoctors.length} médicos:
                                            </span>
                                            {admin.assignedDoctors.length === 0 ? (
                                                <Badge variant="outline" className="ml-2 text-muted-foreground">
                                                    Sin médicos asignados
                                                </Badge>
                                            ) : (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {admin.assignedDoctors.map((doctorId) => {
                                                        const doctor = doctorsData.find(d => d.id === doctorId);
                                                        return doctor ? (
                                                            <Badge
                                                                key={doctorId}
                                                                variant="secondary"
                                                                className="text-xs flex items-center space-x-1"
                                                            >
                                                                <span>Dr. {doctor.firstName} {doctor.lastName}</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUnassignDoctor(doctorId, admin.id);
                                                                    }}
                                                                    className="ml-1 hover:text-red-400"
                                                                >
                                                                    <Unlink className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Assignment Interface */}
                                        {selectedAdmin === admin.id && (
                                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm font-medium text-foreground mb-2">
                                                    Asignar médicos disponibles:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {doctorsData
                                                        .filter(doctor =>
                                                            doctor.isActive &&
                                                            !admin.assignedDoctors.includes(doctor.id)
                                                        )
                                                        .map((doctor) => (
                                                            <Button
                                                                key={doctor.id}
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAssignDoctor(doctor.id, admin.id);
                                                                }}
                                                                className="text-xs"
                                                            >
                                                                <Plus className="h-3 w-3 mr-1" />
                                                                Dr. {doctor.firstName} {doctor.lastName}
                                                            </Button>
                                                        ))}
                                                    {doctorsData.filter(d => d.isActive && !admin.assignedDoctors.includes(d.id)).length === 0 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Todos los médicos activos ya están asignados
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Bottom spacing para mobile */}
            <div className="pb-6"></div>
        </div>
    );
};

export default SuperAdminDashboard;