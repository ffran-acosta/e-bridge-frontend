"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types/auth";

export function RoleSelector({ onChange }: { onChange: (role: Role) => void }) {
    const [role, setRole] = useState<Role>("doctor");
    const set = (r: Role) => { setRole(r); onChange(r); };

    return (
        <div className="flex gap-2">
            <Button
                variant={role === "doctor" ? "default" : "outline"}
                onClick={() => set("doctor")}
            >
                Doctor
            </Button>
            <Button
                variant={role === "admin" ? "default" : "outline"}
                onClick={() => set("admin")}
            >
                Administrador
            </Button>
        </div>
    );
}
