// features/doctor/components/patients/PatientProfile.tsx
'use client';

import React, { useState } from 'react';
import {
    Calendar,
    Plus,
    Edit,
    Download,
    Phone,
    Mail,
    MapPin,
    User,
    Activity,
    FileText
} from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared';

// Tipos para el perfil completo
interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    currentStatus: 'INGRESO' | 'EN_TRATAMIENTO' | 'ALTA' | 'DERIVADO';
    lastConsultation: string;
    birthdate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    address: string;
}

interface PatientProfile extends Patient {
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalHistory: string[];
    currentMedications: string[];
    allergies: string[];
}

interface Consultation {
    id: string;
    date: string;
    type: 'CONSULTA' | 'CONTROL' | 'URGENCIA';
    diagnosis: string;
    treatment: string;
    notes: string;
    doctorName: string;
}

interface Appointment {
    id: string;
    date: string;
    time: string;
    type: 'CONSULTA' | 'CONTROL' | 'ESTUDIOS';
    status: 'PROGRAMADO' | 'COMPLETADO' | 'CANCELADO';
    notes?: string;
}

interface PatientProfileProps {
    patientId?: string;
}

// Mock data para el perfil completo
const mockPatientProfile: PatientProfile = {
    id: '123',
    firstName: 'Juan',
    lastName: 'Pérez',
    dni: '12345678',
    currentStatus: 'EN_TRATAMIENTO',
    birthdate: '1980-05-15',
    gender: 'MALE',
    phone: '+54 11 1234-5678',
    email: 'juan.perez@email.com',
    address: 'Av. Corrientes 1234, CABA',
    lastConsultation: '2024-08-25',
    emergencyContact: {
        name: 'María Pérez',
        phone: '+54 11 9876-5432',
        relationship: 'Esposa'
    },
    medicalHistory: [
        'Fractura de tibia izquierda (2023)',
        'Lesión menisco rodilla derecha (2022)',
        'Distensión cervical (2021)'
    ],
    currentMedications: [
        'Ibuprofeno 600mg - cada 8hs',
        'Diclofenac gel - aplicar 2 veces al día'
    ],
    allergies: ['Penicilina', 'Polen']
};

const mockConsultations: Consultation[] = [
    {
        id: '1',
        date: '2024-08-25',
        type: 'CONSULTA',
        diagnosis: 'Evolución favorable de fractura de tibia',
        treatment: 'Continuar fisioterapia, reducir carga de apoyo',
        notes: 'Paciente refiere mejoría en dolor. Se observa buena consolidación en radiografías.',
        doctorName: 'Dr. Juan Médico'
    },
    {
        id: '2',
        date: '2024-08-10',
        type: 'CONTROL',
        diagnosis: 'Control post-quirúrgico fractura tibia',
        treatment: 'Mantenimiento de yeso, ejercicios pasivos',
        notes: 'Sin signos de infección. Paciente tolera bien el tratamiento.',
        doctorName: 'Dr. Juan Médico'
    }
];

const mockAppointments: Appointment[] = [
    {
        id: '1',
        date: '2024-09-05',
        time: '10:00',
        type: 'CONTROL',
        status: 'PROGRAMADO',
        notes: 'Control evolución fractura'
    },
    {
        id: '2',
        date: '2024-09-15',
        time: '14:30',
        type: 'ESTUDIOS',
        status: 'PROGRAMADO',
        notes: 'Radiografía de control'
    }
];

export function PatientProfile({ patientId }: PatientProfileProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // En la implementación real, aquí harías fetch del paciente por ID
    const patient = mockPatientProfile;

    const calculateAge = (birthdate: string) => {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getStatusBadge = (status: PatientProfile['currentStatus']) => {
        const variants = {
            'INGRESO': 'default',
            'EN_TRATAMIENTO': 'secondary',
            'ALTA': 'outline',
            'DERIVADO': 'destructive'
        } as const;

        return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                </Button>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                </Button>
            </div>

            {/* Patient Header Card */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{patient.firstName} {patient.lastName}</CardTitle>
                                <p className="text-muted-foreground">DNI: {patient.dni} • {calculateAge(patient.birthdate)} años</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    {getStatusBadge(patient.currentStatus)}
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">Última consulta: {patient.lastConsultation}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{patient.address}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Tabs para diferentes secciones */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="consultations">Consultas</TabsTrigger>
                    <TabsTrigger value="appointments">Turnos</TabsTrigger>
                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                </TabsList>

                {/* Tab: Resumen */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información Médica */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Activity className="h-5 w-5 mr-2" />
                                    Información Médica
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Historial Médico</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        {patient.medicalHistory.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Medicamentos Actuales</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        {patient.currentMedications.map((med, index) => (
                                            <li key={index}>{med}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Alergias</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.allergies.map((allergy, index) => (
                                            <Badge key={index} variant="destructive">{allergy}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contacto de Emergencia */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contacto de Emergencia</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="font-medium">{patient.emergencyContact.name}</p>
                                    <p className="text-sm text-muted-foreground">{patient.emergencyContact.relationship}</p>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{patient.emergencyContact.phone}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: Consultas */}
                <TabsContent value="consultations" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Historial de Consultas</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Consulta
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {mockConsultations.map((consultation) => (
                            <Card key={consultation.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{consultation.date}</CardTitle>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge variant="outline">{consultation.type}</Badge>
                                                <span className="text-sm text-muted-foreground">por {consultation.doctorName}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <h4 className="font-medium text-sm">Diagnóstico</h4>
                                        <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">Tratamiento</h4>
                                        <p className="text-sm text-muted-foreground">{consultation.treatment}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">Notas</h4>
                                        <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Tab: Turnos */}
                <TabsContent value="appointments" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Próximos Turnos</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Turno
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {mockAppointments.map((appointment) => (
                            <Card key={appointment.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{appointment.date}</span>
                                                <span className="text-muted-foreground">•</span>
                                                <span>{appointment.time}</span>
                                            </div>
                                            <Badge variant={appointment.status === 'PROGRAMADO' ? 'default' : 'outline'}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                        <Badge variant="secondary">{appointment.type}</Badge>
                                    </div>
                                    {appointment.notes && (
                                        <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Tab: Documentos */}
                <TabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Documentos</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Subir Documento
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground py-12">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No hay documentos subidos aún</p>
                                <p className="text-sm">Los estudios médicos, radiografías y reportes aparecerán aquí</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal de edición (placeholder) */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Paciente</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-muted-foreground">El formulario de edición se implementará en la siguiente fase.</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={() => setIsEditModalOpen(false)}>
                            Guardar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}