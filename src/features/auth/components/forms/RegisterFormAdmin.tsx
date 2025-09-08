"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterAdminInput, adminRegisterSchema } from "../../lib/schemas";
import { useAuthStore } from "../../store/auth";
import { Input, Button, useFormSubmission } from "@/shared";
import { FormFieldWrapper } from "@/shared/components/forms/FormField";

export default function RegisterFormAdmin() {
    const { registerAdmin } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterAdminInput>({
        resolver: zodResolver(adminRegisterSchema),
    });

    const { loading, handleSubmit: handleFormSubmit } = useFormSubmission({
        onSubmit: registerAdmin,
        successMessage: "Administrador creado correctamente",
        errorMessage: "Error al crear administrador"
    });

    return (
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <FormFieldWrapper
                label="Nombre"
                error={errors.firstName?.message}
                required
            >
                <Input {...register("firstName")} />
            </FormFieldWrapper>

            <FormFieldWrapper
                label="Apellido"
                error={errors.lastName?.message}
                required
            >
                <Input {...register("lastName")} />
            </FormFieldWrapper>

            <FormFieldWrapper
                label="Email"
                error={errors.email?.message}
                required
            >
                <Input type="email" {...register("email")} />
            </FormFieldWrapper>

            <FormFieldWrapper
                label="Contraseña"
                error={errors.password?.message}
                required
            >
                <Input type="password" {...register("password")} />
            </FormFieldWrapper>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando..." : "Registrar Administrador"}
            </Button>
        </form>
    );
}
