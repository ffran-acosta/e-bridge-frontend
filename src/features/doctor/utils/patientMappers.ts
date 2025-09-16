/**
 * Mappers para transformar datos entre diferentes formatos
 */

import { BackendPatient, Patient } from "@/shared/types/patients.types";

// ========== MAPPER PARA LISTA DE PACIENTES ==========

/**
 * Transforma un paciente del backend al formato esperado por el frontend
 */
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