"use client";

import { AuthCard } from "@/features";
import LoginForm from "@/features/auth/components/forms/LoginForm";

export default function Page() {
    return (
        <AuthCard title="Iniciar sesión">
            <LoginForm />
        </AuthCard>
    );
}
