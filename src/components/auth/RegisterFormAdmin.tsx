"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    adminRegisterSchema,
    type RegisterAdminInput,
} from "@/lib/schemas";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";

export default function RegisterFormAdmin() {
    const { loading, registerAdmin } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterAdminInput>({
        resolver: zodResolver(adminRegisterSchema),
    });

    const onSubmit = async (data: RegisterAdminInput) => {
        try {
            await registerAdmin(data);
            toast.success("Admin created");
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
                <Label>Clinic name</Label>
                <Input {...register("clinic_name")} />
                {errors.clinic_name && <p className="text-sm text-red-600">{errors.clinic_name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register("phone")} />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Register Admin"}
            </Button>
        </form>
    );
}
