"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard, RoleSelector, AuthGuard } from "@/features";
import { Role } from "@/shared/types/auth";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";
import RegisterFormDoctor from "@/features/auth/components/forms/RegisterFormDoctor";
import RegisterFormAdmin from "@/features/auth/components/forms/RegisterFormAdmin";

export default function RegisterPage() {
    const [role, setRole] = useState<Role>("DOCTOR");
    const router = useRouter();

    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN"]}>
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-2xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/super-admin')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al Panel
                    </Button>

                    <AuthCard title="Crear cuenta">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Seleccioná el tipo de usuario</p>
                                <RoleSelector onChange={setRole} />
                            </div>

                            {role === "DOCTOR" ? <RegisterFormDoctor /> : <RegisterFormAdmin />}
                        </div>
                    </AuthCard>
                </div>
            </div>
        </AuthGuard>
    );
}

