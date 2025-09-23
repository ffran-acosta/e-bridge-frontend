'use client';

import { lazy, Suspense } from 'react';
import { PatientProfile } from './PatientProfile';

// Componente de loading personalizado
const PatientProfileLoading = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando perfil del paciente...</p>
        </div>
    </div>
);

// Lazy loading del PatientProfile
const LazyPatientProfileComponent = lazy(() => 
    Promise.resolve({ default: PatientProfile })
);

interface LazyPatientProfileProps {
    patientId?: string;
}

export const LazyPatientProfile = ({ patientId }: LazyPatientProfileProps) => {
    return (
        <Suspense fallback={<PatientProfileLoading />}>
            <LazyPatientProfileComponent patientId={patientId} />
        </Suspense>
    );
};
