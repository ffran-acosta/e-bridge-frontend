"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuthStore } from "../../store/auth";
import { RegisterDoctorInput, doctorRegisterSchema } from "../../lib/schemas";
import { SpecialtySelectField } from "./SpecialtySelectField";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared";

const defaultValues: Partial<RegisterDoctorInput> = {
    specialtyId: "",
    province: undefined,
};

export default function RegisterFormDoctor() {
    const { loading, registerDoctor } = useAuthStore();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterDoctorInput>({
        resolver: zodResolver(doctorRegisterSchema),
        defaultValues,
    });

    const onSubmit = async (data: RegisterDoctorInput) => {
        try {
            await registerDoctor(data);
            toast.success("Doctor created");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Register failed";
            toast.error(message);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
                <Label>Nombre</Label>
                <Input {...register("firstName")} />
                {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Apellido</Label>
                <Input {...register("lastName")} />
                {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input type="password" {...register("password")} />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Matrícula</Label>
                <Input {...register("licenseNumber")} />
                {errors.licenseNumber && (
                    <p className="text-sm text-destructive">
                        {errors.licenseNumber.message}
                    </p>
                )}
            </div>

            <SpecialtySelectField
                control={control}
                name="specialtyId"
                errors={errors}
            />

            <div className="space-y-2">
                <Label>Provincia</Label>
                <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccioná una provincia" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                                <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.province && (
                    <p className="text-sm text-destructive">{errors.province.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando..." : "Registrar Doctor"}
            </Button>
        </form>
    );
}
