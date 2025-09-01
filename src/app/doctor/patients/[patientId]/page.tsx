'use client';
import { PatientProfile } from '@/features/doctor/components/patients/PatientProfile';

interface PatientPageProps {
    params: {
        patientId: string;
    };
}

export default function PatientPage({ params }: PatientPageProps) {
    return <PatientProfile patientId={params.patientId} />;
}