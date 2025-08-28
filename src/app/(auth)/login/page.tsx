"use client";

import { AuthCard } from "@/features";
import LoginForm from "@/features/auth/components/forms/LoginForm";
import Link from "next/link";

export default function Page() {
    return (
        <AuthCard title="Iniciar sesión">
            <LoginForm />
            <p className="text-sm text-neutral-600">
                ¿No tenés cuenta?{" "}
                <Link href="/register" className="underline">
                    Crear cuenta
                </Link>
            </p>
        </AuthCard>
    );
}
