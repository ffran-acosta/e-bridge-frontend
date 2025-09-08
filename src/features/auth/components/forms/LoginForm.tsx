"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, useFormSubmission } from "@/shared";
import { FormFieldWrapper } from "@/shared/components/forms/FormField";
import { useAuthRedirect } from "../../hook/useAuthRedirect";
import { LoginInput, loginSchema } from "../../lib/schemas";
import { useAuthStore } from "../../store/auth";

export default function LoginForm() {
    const { login } = useAuthStore();
    useAuthRedirect();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const { loading, handleSubmit: handleFormSubmit } = useFormSubmission({
        onSubmit: login,
        successMessage: "Sesión iniciada correctamente",
        errorMessage: "Error al iniciar sesión"
    });

    return (
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <FormFieldWrapper
                label="Email"
                error={errors.email?.message}
                required
            >
                <Input
                    id="email"
                    type="email"
                    placeholder="email@ejemplo.com"
                    {...register("email")}
                />
            </FormFieldWrapper>

            <FormFieldWrapper
                label="Contraseña"
                error={errors.password?.message}
                required
            >
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                />
            </FormFieldWrapper>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Ingresando..." : "Login"}
            </Button>

            <div className="text-sm text-right text-muted-foreground">
                <Link href="/auth/forgot-password" className="underline">
                    Recuperar contraseña
                </Link>
            </div>
        </form>
    );
}
