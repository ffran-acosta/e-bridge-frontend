"use client";

import { AuthCard } from "@/features";
import LoginForm from "@/features/auth/components/forms/LoginForm";

export default function Page() {
    return (
        <AuthCard title="Bienvenido a e-Bridge">
            <LoginForm />
        </AuthCard>
    );
}
