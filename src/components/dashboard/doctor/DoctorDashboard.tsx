'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    User,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Shield,
    Stethoscope,
    Users,
    Clock
} from 'lucide-react';

// Datos hardcodeados para la demo - pacientes del médico logueado
const patientsData = [
    {
        id: '1',
        firstName: 'Ana',
        lastName: 'García',
        dni: '12345678',
        gender: 'FEMENINO',
        birthdate: '1985-03-15',
        age: 39,
        phone: '+54 11 1234-5678',
        email: 'ana.garcia@email.com',
        insurance: 'OSDE',
        insurancePlan: 'Plan 410',
        address: 'Av. Corrientes 1234, CABA',
        lastVisit: '2024-08-15',
        nextAppointment: '2024-08-25',
        status: 'active'
    },
    {
        id: '2',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        dni: '23456789',
        gender: 'MASCULINO',
        birthdate: '1978-11-22',
        age: 45,
        phone: '+54 11 2345-6789',
        email: 'carlos.rodriguez@email.com',
        insurance: 'Swiss Medical',
        insurancePlan: 'SMG01',
        address: 'Av. Santa Fe 5678, CABA',
        lastVisit: '2024-08-10',
        nextAppointment: null,
        status: 'active'
    },
    {
        id: '3',
        firstName: 'María',
        lastName: 'López',
        dni: '34567890',
        gender: 'FEMENINO',
        birthdate: '1992-07-08',
        age: 32,
        phone: '+54 11 3456-7890',
        email: 'maria.lopez@email.com',
        insurance: 'Galeno',
        insurancePlan: 'Blue',
        address: 'Av. Cabildo 9012, CABA',
        lastVisit: '2024-08-18',
        nextAppointment: '2024-08-22',
        status: 'priority'
    },
    {
        id: '4',
        firstName: 'Roberto',
        lastName: 'Martínez',
        dni: '45678901',
        gender: 'MASCULINO',
        birthdate: '1965-12-03',
        age: 58,
        phone: '+54 11 4567-8901',
        email: 'roberto.martinez@email.com',
        insurance: 'IOMA',
        insurancePlan: 'Básico',
        address: 'Av. Rivadavia 3456, CABA',
        lastVisit: '2024-07-28',
        nextAppointment: '2024-08-30',
        status: 'follow-up'
    },
    {
        id: '5',
        firstName: 'Laura',
        lastName: 'Fernández',
        dni: '56789012',
        gender: 'FEMENINO',
        birthdate: '1990-04-17',
        age: 34,
        phone: '+54 11 5678-9012',
        email: 'laura.fernandez@email.com',
        insurance: 'Medicus',
        insurancePlan: 'Premium',
        address: 'Av. Las Heras 7890, CABA',
        lastVisit: '2024-08-12',
        nextAppointment: '2024-08-28',
        status: 'active'
    },
    {
        id: '6',
        firstName: 'Diego',
        lastName: 'Silva',
        dni: '67890123',
        gender: 'MASCULINO',
        birthdate: '1988-09-30',
        age: 35,
        phone: '+54 11 6789-0123',
        email: 'diego.silva@email.com',
        insurance: 'Galeno',
        insurancePlan: 'Red',
        address: 'Av. Belgrano 2345, CABA',
        lastVisit: '2024-08-05',
        nextAppointment: '2024-08-21',
        status: 'active'
    }
];

// Datos del médico logueado
const doctorData = {
    firstName: 'María',
    lastName: 'González',
    specialty: 'Cardiología',
    licenseNumber: 'MP-12345'
};

const DoctorDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patientsData.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.dni.includes(searchTerm) ||
        patient.insurance.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePatientClick = (patientId: string) => {
        // Aquí irá la navegación al perfil completo del paciente
        console.log(`Ver historial del paciente: ${patientId}`);
        alert(`Ver historial de ${filteredPatients.find(p => p.id === patientId)?.firstName}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'priority':
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Prioritario</Badge>;
            case 'follow-up':
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Seguimiento</Badge>;
            default:
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>;
        }
    };

    const todayAppointments = filteredPatients.filter(p =>
        p.nextAppointment === new Date().toISOString().split('T')[0]
    ).length;

    const upcomingAppointments = filteredPatients.filter(p =>
        p.nextAppointment && p.nextAppointment > new Date().toISOString().split('T')[0]
    ).length;

    return (
        <div className="min-h-screen bg-background p-4 theme-ebridge-dark">
            {/* Header */}
            <div className="mb-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Mis Pacientes
                    </h1>
                    <p className="text-muted-foreground">
                        Dr. {doctorData.firstName} {doctorData.lastName} • {doctorData.specialty}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <Card>
                        <CardContent className="p-3">
                            <div className="flex flex-col items-center text-center">
                                <Users className="h-5 w-5 text-primary mb-1" />
                                <p className="text-lg font-bold text-foreground">{filteredPatients.length}</p>
                                <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="flex flex-col items-center text-center">
                                <Calendar className="h-5 w-5 text-accent mb-1" />
                                <p className="text-lg font-bold text-foreground">{todayAppointments}</p>
                                <p className="text-xs text-muted-foreground">Hoy</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="flex flex-col items-center text-center">
                                <Clock className="h-5 w-5 text-green-500 mb-1" />
                                <p className="text-lg font-bold text-foreground">{upcomingAppointments}</p>
                                <p className="text-xs text-muted-foreground">Próximos</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Buscador */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Buscar paciente por nombre, DNI o obra social..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Lista de pacientes */}
            <div className="space-y-4">
                {filteredPatients.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                No se encontraron pacientes
                            </h3>
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no tienes pacientes asignados'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPatients.map((patient) => (
                        <Card
                            key={patient.id}
                            className="transition-all duration-200 hover:shadow-md cursor-pointer"
                            onClick={() => handlePatientClick(patient.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-primary font-semibold text-sm">
                                            {getInitials(patient.firstName, patient.lastName)}
                                        </span>
                                    </div>

                                    {/* Info principal */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="text-lg font-semibold text-foreground truncate">
                                                        {patient.firstName} {patient.lastName}
                                                    </h3>
                                                    {getStatusBadge(patient.status)}
                                                </div>
                                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                                    <span>DNI: {patient.dni}</span>
                                                    <span>•</span>
                                                    <span>{patient.age} años</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Obra social */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Shield className="h-4 w-4 text-accent" />
                                            <span className="text-sm font-medium text-foreground">
                                                {patient.insurance}
                                            </span>
                                            {patient.insurancePlan && (
                                                <Badge variant="outline" className="text-xs">
                                                    {patient.insurancePlan}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Contacto */}
                                        <div className="space-y-1 mb-3">
                                            {patient.phone && (
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{patient.phone}</span>
                                                </div>
                                            )}
                                            {patient.email && (
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{patient.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Fechas importantes */}
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <div className="flex items-center space-x-1 text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>Última: {formatDate(patient.lastVisit)}</span>
                                            </div>
                                            {patient.nextAppointment && (
                                                <div className="flex items-center space-x-1 text-accent">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="font-medium">Próxima: {formatDate(patient.nextAppointment)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Bottom spacing para mobile */}
            <div className="pb-6"></div>
        </div>
    );
};

export default DoctorDashboard;