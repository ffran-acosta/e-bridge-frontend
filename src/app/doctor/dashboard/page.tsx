'use client';
import { PatientsList } from '@/features/doctor/components/patients/PatientList';
import { useRouter } from 'next/navigation';
import { Patient } from '@/shared/types/patients.types';

export default function DashboardPage() {
    const router = useRouter();

    const handlePatientClick = (patient: Patient) => {
        router.push(`/doctor/patients/${patient.id}`);
    };

    return <PatientsList onPatientClick={handlePatientClick} />;
}