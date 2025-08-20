'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Search,
    User,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Shield
} from 'lucide-react';

// Datos hardcodeados para la demo
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
        nextAppointment: '2024-08-25'
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
        nextAppointment: null
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
        nextAppointment: '2024-08-22'
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
        nextAppointment: '2024-08-30'
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
        nextAppointment: '2024-08-28'
    }
];

const doctorData = {
    id: '1',
    firstName: 'María',
    lastName: 'González',
    specialty: 'Cardiología'
};

interface PatientsListProps {
    doctorId: string;
}

const PatientsList = ({ doctorId }: PatientsListProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    // En el futuro aquí harás fetch de datos reales basado en doctorId
    // const { data: doctor } = useFetch(`/api/doctors/${doctorId}`);
    // const { data: patients } = useFetch(`/api/doctors/${doctorId}/patients`);

    console.log('Mostrando pacientes del doctor:', doctorId);

    const filteredPatients = patientsData.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.dni.includes(searchTerm) ||
        patient.insurance.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBack = () => {
        // Aquí irá la navegación de vuelta al dashboard
        console.log('Navegando de vuelta al dashboard de admin');
        alert('Volver al panel de gestión');
    };

    const handlePatientClick = (patientId: string) => {
        // Aquí irá la navegación al perfil del paciente
        console.log(`Ver perfil del paciente: ${patientId}`);
        alert(`Ver perfil de ${filteredPatients.find(p => p.id === patientId)?.firstName}`);
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

    return (
        <div className="min-h-screen bg-background p-4 theme-ebridge-dark">
            {/* Header con botón back */}
            <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleBack}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-foreground">
                            Dr. {doctorData.firstName} {doctorData.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {doctorData.specialty} • {filteredPatients.length} pacientes
                        </p>
                    </div>
                </div>

                {/* Buscador */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Buscar por nombre, DNI o obra social..."
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
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Este médico aún no tiene pacientes asignados'}
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
                                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-accent font-semibold text-sm">
                                            {getInitials(patient.firstName, patient.lastName)}
                                        </span>
                                    </div>

                                    {/* Info principal */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground truncate">
                                                    {patient.firstName} {patient.lastName}
                                                </h3>
                                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                                    <span>DNI: {patient.dni}</span>
                                                    <span>•</span>
                                                    <span>{patient.age} años</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{patient.gender.toLowerCase()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Obra social */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Shield className="h-4 w-4 text-primary" />
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
                                            {patient.address && (
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{patient.address}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Fechas importantes */}
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <div className="flex items-center space-x-1 text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>Última visita: {formatDate(patient.lastVisit)}</span>
                                            </div>
                                            {patient.nextAppointment && (
                                                <div className="flex items-center space-x-1 text-accent">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="font-medium">Próximo: {formatDate(patient.nextAppointment)}</span>
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

export default PatientsList;