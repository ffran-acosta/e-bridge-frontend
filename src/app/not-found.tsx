"use client";

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features';
import { getRedirectPath } from '@/features/auth/lib/redirects';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function NotFound() {
    const router = useRouter();
    const { user, isInitialized } = useAuthStore();

    const handleRedirect = () => {
        if (user) {
            // Si el usuario está autenticado, redirigir a su dashboard correspondiente
            const redirectPath = getRedirectPath(user.role);
            router.push(redirectPath);
        } else {
            // Si no está autenticado, redirigir al login
            router.push('/login');
        }
    };

    // No mostrar nada hasta que la autenticación esté inicializada
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 text-6xl font-bold text-muted-foreground">
                        404
                    </div>
                    <CardTitle className="text-2xl">Página no encontrada</CardTitle>
                    <CardDescription>
                        La página que buscas no existe o ha sido movida.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                        onClick={handleRedirect}
                        className="w-full"
                        size="lg"
                    >
                        {user ? 'Ir a mi perfil' : 'Iniciar sesión'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

