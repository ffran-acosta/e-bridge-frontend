"use client";

import { Controller } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { UpdateProfileInput } from "../../lib/profile-form.schema";
import { SpecialtySelectField } from "./SpecialtySelectField";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Alert } from "@/shared";

interface EditProfileFormProps {
    form: UseFormReturn<UpdateProfileInput>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
}

export function EditProfileForm({
    form,
    handleSubmit,
    isSubmitting,
    error,
}: EditProfileFormProps) {
    const router = useRouter();
    const { register, control, formState: { errors } } = form;

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </Alert>
            )}

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
                <Input 
                    type="password" 
                    {...register("password")} 
                    placeholder="Dejar en blanco para mantener la contraseña actual"
                    defaultValue=""
                />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                    Solo completa este campo si deseas cambiar tu contraseña
                </p>
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

            <div className="flex gap-3 pt-4">
                <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </div>
        </form>
    );
}
