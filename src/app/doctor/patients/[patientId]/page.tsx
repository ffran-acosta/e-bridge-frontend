'use client';
import { use } from 'react';
import { PatientProfile } from '@/features/doctor/components/patients/PatientProfile';

interface PatientPageProps {
    params: Promise<{
        patientId: string;
    }>;
}

export default function PatientPage({ params }: PatientPageProps) {
    const { patientId } = use(params);
    return <PatientProfile patientId={patientId} />;
}