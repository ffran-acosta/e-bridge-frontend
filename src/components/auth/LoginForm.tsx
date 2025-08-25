"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function LoginForm() {
    const { loading, login } = useAuthStore();
    useAuthRedirect();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data);
            toast.success("Logged in");
        } catch (e: any) {
            toast.error(e.message ?? "Login failed");
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="email@ejemplo.com"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
            </div>

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
