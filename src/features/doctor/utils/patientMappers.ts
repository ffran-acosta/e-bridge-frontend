// Mappers para transformar datos entre diferentes formatos

import { BackendPatient, Patient, BackendPatientProfile, PatientProfile, BackendConsultation, Consultation } from "@/shared/types/patients.types";

// ========== MAPPER PARA LISTA DE PACIENTES ==========

// Transforma un paciente del backend al formato esperado por el frontend
export const mapBackendPatientToFrontend = (backendPatient: BackendPatient): Patient => {
    return {
        id: backendPatient.id,
        fullName: `${backendPatient.lastName}, ${backendPatient.firstName}`,
        dni: backendPatient.dni,
        age: backendPatient.age,
        gender: backendPatient.gender,
        phone: backendPatient.phone1,
        email: backendPatient.email,
        address: `${backendPatient.city}, ${backendPatient.province}`,
        status: backendPatient.currentStatus,
        lastConsultationDate: backendPatient.lastConsultationDate || '',
        insuranceName: backendPatient.insurance.name
    };
};

// ========== MAPPER PARA PERFIL DE PACIENTE ==========

// Transforma el perfil de paciente del backend al formato esperado por el frontend
export const mapBackendPatientProfileToFrontend = (backendProfile: BackendPatientProfile): PatientProfile => {
    return {
        id: backendProfile.id,
        firstName: backendProfile.firstName,
        lastName: backendProfile.lastName,
        dni: backendProfile.dni,
        gender: backendProfile.gender,
        birthdate: backendProfile.birthdate,
        type: backendProfile.type,
        currentStatus: backendProfile.currentStatus as 'INGRESO' | 'EN_TRATAMIENTO' | 'ALTA' | 'DERIVADO',
        street: backendProfile.street,
        streetNumber: backendProfile.streetNumber,
        floor: backendProfile.floor,
        apartment: backendProfile.apartment,
        city: backendProfile.city,
        province: backendProfile.province,
        postalCode: backendProfile.postalCode,
        phone1: backendProfile.phone1,
        phone2: backendProfile.phone2,
        email: backendProfile.email,
        emergencyContactName: backendProfile.emergencyContactName,
        emergencyContactPhone: backendProfile.emergencyContactPhone,
        emergencyContactRelation: backendProfile.emergencyContactRelation,
        medicalHistory: backendProfile.medicalHistory,
        currentMedications: backendProfile.currentMedications,
        allergies: backendProfile.allergies,
        insurance: {
            id: backendProfile.insurance.id,
            code: '', // No viene en la respuesta del backend
            name: backendProfile.insurance.name,
            planName: backendProfile.insurance.planName,
            contactInfo: null, // No viene en la respuesta del backend
            isActive: backendProfile.insurance.isActive
        },
        siniestro: backendProfile.siniestro, // Mapear el siniestro del backend
        assignedDoctors: backendProfile.assignedDoctors.map(assignment => ({
            id: assignment.id,
            assignedAt: assignment.assignedAt,
            isActive: assignment.isActive,
            notes: '', // No viene en la respuesta del backend
            doctor: {
                id: assignment.doctor.id,
                licenseNumber: assignment.doctor.licenseNumber,
                user: {
                    firstName: assignment.doctor.user.firstName,
                    lastName: assignment.doctor.user.lastName
                },
                specialty: {
                    name: assignment.doctor.specialty.name
                }
            }
        })),
        stats: {
            totalConsultations: backendProfile.stats.totalConsultations,
            totalAppointments: backendProfile.stats.totalAppointments,
            lastConsultationDate: backendProfile.stats.lastConsultationDate,
            nextAppointmentDate: backendProfile.stats.nextAppointmentDate
        },
        createdAt: backendProfile.createdAt,
        updatedAt: backendProfile.updatedAt
    };
};

// ========== MAPPER PARA CONSULTAS ==========

// Transforma una consulta del backend al formato esperado por el frontend
export const mapBackendConsultationToFrontend = (backendConsultation: any): Consultation => {
    console.log('🔍 Mapeando consulta del backend:', backendConsultation);
    
    // Manejar diferentes estructuras de respuesta del backend
    const consultation = backendConsultation.data || backendConsultation;
    
    return {
        patientId: consultation.patientId,
        id: consultation.id,
        consultationReason: consultation.consultationReason,
        diagnosis: consultation.diagnosis,
        nextAppointmentDate: consultation.nextAppointmentDate,
        isArtCase: consultation.type === 'INGRESO' || consultation.type === 'ATENCION',
        consultationType: consultation.type, // Agregar el tipo de consulta
        medicalEstablishment: {
            id: consultation.medicalEstablishment?.id || '',
            name: consultation.medicalEstablishment?.name || 'Establecimiento no especificado'
        },
        employer: null, // No viene en la respuesta del backend
        doctor: {
            id: consultation.doctor?.id || '',
            licenseNumber: consultation.doctor?.licenseNumber || '',
            fullName: consultation.doctor?.user 
                ? `${consultation.doctor.user.firstName} ${consultation.doctor.user.lastName}`
                : 'Doctor no especificado',
            specialtyName: consultation.doctor?.specialty?.name || 'Especialidad no especificada'
        },
        appointmentInfo: {
            hasOriginAppointment: false, // No viene en la respuesta del backend
            hasNextAppointment: !!consultation.nextAppointmentDate,
            nextAppointmentId: null // No viene en la respuesta del backend
        },
        createdAt: consultation.createdAt,
        updatedAt: consultation.updatedAt
    };
};