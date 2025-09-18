'use client';
import { AuthGuard } from '@/features';
import { DoctorLayout } from '@/features/doctor/components/dashboard/DoctorLayout';
import { usePathname, useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    
    // Detectar si estamos en la vista del perfil del paciente
    const isPatientProfile = pathname.includes('/doctor/patients/') && pathname !== '/doctor/patients';
    
    const handleBackClick = () => {
        router.push('/doctor/dashboard');
    };

    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR"]}>
            <DoctorLayout 
                currentView={isPatientProfile ? 'patientProfile' : 'dashboard'}
                onBackClick={isPatientProfile ? handleBackClick : undefined}
            >
                {children}
            </DoctorLayout>
        </AuthGuard>
    );
}