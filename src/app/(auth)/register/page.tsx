"use client";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { RoleSelector } from "@/components/auth/RoleSelector";
import RegisterFormDoctor from "@/components/auth/RegisterFormDoctor";
import RegisterFormAdmin from "@/components/auth/RegisterFormAdmin";
import type { Role } from "@/types/auth";
import Link from "next/link";

export default function Page() {
    const [role, setRole] = useState<Role>("doctor");

    return (
        <AuthCard title="Crear cuenta">
            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-sm text-neutral-600">Seleccioná el tipo de usuario</p>
                    <RoleSelector onChange={setRole} />
                </div>

                {role === "doctor" ? <RegisterFormDoctor /> : <RegisterFormAdmin />}

                <p className="text-sm text-neutral-600">
                    ¿Ya tenés cuenta?{" "}
                    <Link href="/auth/login" className="underline">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </AuthCard>
    );
}
