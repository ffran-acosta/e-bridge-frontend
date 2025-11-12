"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DOCTOR_ENDPOINTS } from '../constants/endpoints';

interface ConsultationDetails {
  id: string;
  patientId: string;
  doctorId: string;
  medicalEstablishmentId: string;
  type: 'INGRESO' | 'ATENCION' | 'ALTA';
  consultationReason: string;
  diagnosis: string;
  medicalIndications: string;
  nextAppointmentDate: string | null;
  createdAt: string;
  updatedAt: string;
  medicalAssistancePlace: string;
  medicalAssistanceDate: string;
  patientSignature: string | null;
  doctorSignature: string | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dni: string;
    gender: string;
    birthdate: string;
    insuranceId: string;
    type: 'NORMAL' | 'ART';
    street: string;
    streetNumber: string;
    floor: string;
    apartment: string;
    city: string;
    province: string;
    postalCode: string;
    phone1: string;
    phone2: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    currentStatus: string;
    allergies: string[];
    currentMedications: string[];
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    medicalHistory: string[];
    insurance: {
      id: string;
      code: string;
      name: string;
      planName: string;
      contactInfo: any;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    siniestro?: {
      id: string;
      patientId: string;
      artId: string;
      medicalEstablishmentId: string;
      contingencyType: string;
      accidentDateTime: string;
      employerId: string;
      createdAt: string;
      updatedAt: string;
      closedAt: string | null;
      closedByDoctorId: string | null;
      status: string;
      dischargeReason: string | null;
      art: {
        id: string;
        name: string;
        code: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      };
      employer: {
        id: string;
        name: string;
        cuit: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      };
      medicalEstablishment: {
        id: string;
        name: string;
        cuit: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
  doctor: {
    id: string;
    userId: string;
    licenseNumber: string;
    specialtyId: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    specialty: {
      id: string;
      code: string;
      name: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  medicalEstablishment: {
    id: string;
    name: string;
    cuit: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  artDetails?: {
    id: string;
    medicalEventId: string;
    siniestroId: string;
    employerId: string | null;
    accidentDateTime: string;
    workAbsenceStartDateTime: string;
    firstMedicalAttentionDateTime: string;
    workSickLeave: boolean;
    probableDischargeDate: string | null;
    nextRevisionDate: string | null;
    workReturnDate: string | null;
    accidentEstablishmentName: string;
    accidentEstablishmentAddress: string;
    accidentEstablishmentPhone: string;
    accidentContactName: string;
    accidentContactCellphone: string;
    accidentContactEmail: string;
    nextRevisionDateTime: string | null;
    pendingMedicalTreatment: string | null;
    pendingTreatmentTypes: string[];
    professionalRequalification: string | null;
    treatmentEndDateTime: string | null;
    itlCeaseReason: string | null;
    derivationReason: string | null;
    inculpableAffection: string | null;
    disablingSequelae: string | null;
    maintenanceBenefits: string | null;
    psychologicalTreatment: string | null;
    sequelaeEstimationRequired: string | null;
    finalTreatmentEndDateTime: string | null;
    finalDisablingSequelae: string | null;
    finalProfessionalRequalification: string | null;
    finalMaintenanceBenefits: string | null;
    finalPsychologicalTreatment: string | null;
    finalSequelaeEstimationRequired: string | null;
    originalContingencyDate: string | null;
    previousDischargeDate: string | null;
    readmissionRequestDate: string | null;
    readmissionAccepted: string | null;
    readmissionDenialReason: string | null;
  };
}

interface ConsultationDetailsApiResponse {
  success?: boolean;
  data?: {
    statusCode?: number;
    data?: ConsultationDetails;
  };
}

interface UseConsultationDetailsProps {
  consultationId: string | null;
  enabled?: boolean;
}

export function useConsultationDetails({ consultationId, enabled = true }: UseConsultationDetailsProps) {
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!consultationId || !enabled) {
      setConsultation(null);
      setError(null);
      return;
    }

    const fetchConsultationDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`🎯 Obteniendo detalles de consulta: ${consultationId}`);
        const endpoint = DOCTOR_ENDPOINTS.consultationById(consultationId);
        
        const response = await api<ConsultationDetailsApiResponse>(endpoint, {
          method: 'GET',
        });

        if (!response) {
          throw new Error('Sin respuesta del servidor al obtener detalles de la consulta');
        }

        console.log('✅ Detalles de consulta obtenidos:', response);
        setConsultation(response.data?.data ?? null);
        
      } catch (err) {
        console.error(`❌ Error al obtener detalles de consulta ${consultationId}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'Error al obtener los detalles de la consulta';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationDetails();
  }, [consultationId, enabled]);

  return {
    consultation,
    loading,
    error,
    refetch: () => {
      if (consultationId) {
        setConsultation(null);
        setError(null);
        // El useEffect se ejecutará automáticamente
      }
    },
  };
}
