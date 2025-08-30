// "use client";

// import { AuthGuard } from "@/features";

// export default function DoctorPage() {
//     return (
//         <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR"]}>
//             <div>DASHBOARD - DOCTOR</div>
//         </AuthGuard>
//     );
// }

'use client';
import { PatientsList } from '@/features/doctor/components/patients/PatientList';
import { useRouter, useParams } from 'next/navigation';

// Tipo para el paciente
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

export default function DashboardPage() {
    const router = useRouter(); // Aquí estaba el error
    const params = useParams();
    const doctorName = params.doctorName as string; // Aquí estaba el otro error

    const handlePatientClick = (patient: Patient) => { // Tipar el parámetro
        router.push(`/doctor/${doctorName}/patients/${patient.id}`);
    };

    return <PatientsList onPatientClick={handlePatientClick} />;
}