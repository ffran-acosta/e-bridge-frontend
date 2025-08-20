'use client';
import PatientsList from '@/components/dashboard/admin/PatientsList';

interface PageProps {
    params: {
        doctorId: string;
    };
}

export default function PatientsPage({ params }: PageProps) {
    const { doctorId } = params;
    console.log('Doctor ID:', doctorId);
    return <PatientsList doctorId={doctorId} />;
}