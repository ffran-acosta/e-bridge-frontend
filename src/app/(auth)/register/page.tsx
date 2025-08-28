"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard, RoleSelector } from "@/features";
import { Role } from "@/features/types/auth";
import RegisterFormDoctor from "@/features/auth/components/forms/RegisterFormDoctor";
import RegisterFormAdmin from "@/features/auth/components/forms/RegisterFormAdmin";

export default function Page() {
    const [role, setRole] = useState<Role>("DOCTOR");

    return (
        <AuthCard title="Crear cuenta">
            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-sm text-neutral-600">Seleccioná el tipo de usuario</p>
                    <RoleSelector onChange={setRole} />
                </div>

                {role === "DOCTOR" ? <RegisterFormDoctor /> : <RegisterFormAdmin />}

                <p className="text-sm text-neutral-600">
                    ¿Ya tenés cuenta?{" "}
                    <Link href="/login" className="underline">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </AuthCard>
    );
}
