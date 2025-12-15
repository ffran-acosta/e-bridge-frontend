'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/shared';
import { useAuthStore } from '@/features/auth/store/auth';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';
import { EditProfileForm } from '@/features/auth/components/forms/EditProfileForm';

export default function ProfilePage() {
    const { user, getCurrentUser } = useAuthStore();
    const router = useRouter();

    const { form, handleSubmit, isSubmitting, error } = useUpdateProfile({
        userData: user,
        onSuccess: async (updatedUser) => {
            // Actualizar el usuario en el store
            await getCurrentUser();
            toast.success('Perfil actualizado exitosamente');
            router.push('/doctor/dashboard');
        },
        onError: (errorMessage) => {
            toast.error(errorMessage || 'Error al actualizar el perfil');
        },
    });

    // Redirigir si no hay usuario o no es doctor
    useEffect(() => {
        if (!user || !['DOCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
            router.push('/doctor/dashboard');
        }
    }, [user, router]);

    if (!user || !['DOCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto py-6">
            <Card className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-2">Mi Perfil</h1>
                    <p className="text-muted-foreground">
                        Actualiza tu información personal y profesional
                    </p>
                </div>
                <EditProfileForm
                    form={form}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            </Card>
        </div>
    );
}
