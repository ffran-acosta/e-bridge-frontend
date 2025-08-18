import { AuthCard } from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
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
