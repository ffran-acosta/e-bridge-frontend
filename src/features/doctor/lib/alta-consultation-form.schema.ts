import { z } from 'zod';

const DISCHARGE_REASON_VALUES = [
  "ALTA_MEDICA",
  "RECHAZO",
  "MUERTE",
  "FIN_TRATAMIENTO",
  "POR_DERIVACION",
] as const;

const DISCHARGE_REASON_LABELS: Record<typeof DISCHARGE_REASON_VALUES[number], string> = {
  ALTA_MEDICA: "Alta Médica",
  RECHAZO: "Rechazo",
  MUERTE: "Muerte",
  FIN_TRATAMIENTO: "Fin de Tratamiento",
  POR_DERIVACION: "Por Derivación",
};

// Enum para motivos de alta
export const DISCHARGE_REASONS = DISCHARGE_REASON_VALUES.map((value) => ({
  value,
  label: DISCHARGE_REASON_LABELS[value],
})) as Array<{
  value: typeof DISCHARGE_REASON_VALUES[number];
  label: string;
}>;

export const altaConsultationFormSchema = z.object({
  medicalEstablishmentId: z.string().uuid({ message: 'Establecimiento médico es requerido' }),
  consultationReason: z.string().min(1, 'Motivo de consulta es requerido'),
  diagnosis: z.string().min(1, 'Diagnóstico es requerido'),
  medicalIndications: z.string().min(1, 'Indicaciones médicas son requeridas'),
  medicalAssistancePlace: z.string().min(1, 'Lugar de asistencia médica es requerido'),
  medicalAssistanceDate: z.string().min(1, 'Fecha de asistencia médica es requerida'),
  artDetails: z.object({
    // Tratamiento pendiente
    pendingMedicalTreatment: z.boolean().default(false),
    pendingTreatmentTypes: z.array(z.string()).default([]),
    
    // Recalificación profesional
    professionalRequalification: z.boolean().default(false),
    
    // Fechas de tratamiento
    treatmentEndDateTime: z.string().optional(),
    finalTreatmentEndDateTime: z.string().optional(),
    
    // Motivo de alta ITL
    itlCeaseReason: z.enum(DISCHARGE_REASON_VALUES),
    derivationReason: z.string().min(1, 'Motivo de derivación es requerido'),
    
    // Afecciones
    inculpableAffection: z.boolean().default(false),
    disablingSequelae: z.boolean().default(false),
    maintenanceBenefits: z.boolean().default(false),
    psychologicalTreatment: z.boolean().default(false),
    sequelaeEstimationRequired: z.boolean().default(false),
    
    // Estados finales
    finalDisablingSequelae: z.boolean().default(false),
    finalProfessionalRequalification: z.boolean().default(false),
    finalMaintenanceBenefits: z.boolean().default(false),
    finalPsychologicalTreatment: z.boolean().default(false),
    finalSequelaeEstimationRequired: z.boolean().default(false),
  }),
});

export type AltaConsultationFormData = z.infer<typeof altaConsultationFormSchema>;

// Función para obtener la fecha actual en formato datetime-local
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  // Ajustar por la zona horaria local
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDateTime.toISOString().slice(0, 16);
};

export const defaultAltaConsultationFormValues: Partial<AltaConsultationFormData> = {
  medicalEstablishmentId: '',
  consultationReason: '',
  diagnosis: '',
  medicalIndications: '',
  medicalAssistancePlace: '',
  medicalAssistanceDate: getCurrentDateTimeLocal(),
  artDetails: {
    pendingMedicalTreatment: false,
    pendingTreatmentTypes: [],
    professionalRequalification: false,
    treatmentEndDateTime: '',
    finalTreatmentEndDateTime: '',
    itlCeaseReason: 'ALTA_MEDICA',
    derivationReason: '',
    inculpableAffection: false,
    disablingSequelae: false,
    maintenanceBenefits: false,
    psychologicalTreatment: false,
    sequelaeEstimationRequired: false,
    finalDisablingSequelae: false,
    finalProfessionalRequalification: false,
    finalMaintenanceBenefits: false,
    finalPsychologicalTreatment: false,
    finalSequelaeEstimationRequired: false,
  },
};
