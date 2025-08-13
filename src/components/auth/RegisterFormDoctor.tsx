"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    doctorRegisterSchema,
    type RegisterDoctorInput,
} from "@/lib/schemas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";

export default function RegisterFormDoctor() {
    const { loading, registerDoctor } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterDoctorInput>({
        resolver: zodResolver(doctorRegisterSchema),
    });

    const onSubmit = async (data: RegisterDoctorInput) => {
        try {
            await registerDoctor(data);
            toast.success("Doctor created");
        } catch (e: any) {
            toast.error(e.message ?? "Register failed");
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
                <Label>Full name</Label>
                <Input {...register("full_name")} />
                {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>License number</Label>
                <Input {...register("license_number")} />
                {errors.license_number && <p className="text-sm text-red-600">{errors.license_number.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Specialty</Label>
                <Input {...register("specialty")} />
                {errors.specialty && <p className="text-sm text-red-600">{errors.specialty.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Register Doctor"}
            </Button>
        </form>
    );
}
