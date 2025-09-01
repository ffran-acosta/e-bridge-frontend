"use client";

import { useState } from "react";
import { Button } from "@/shared";
import { Role } from "@/shared/types/auth";

export function RoleSelector({ onChange }: { onChange: (role: Role) => void }) {
    const [role, setRole] = useState<Role>("DOCTOR");
    const set = (r: Role) => { setRole(r); onChange(r); };

    return (
        <div className="flex gap-2">
            <Button
                variant={role === "DOCTOR" ? "default" : "outline"}
                onClick={() => set("DOCTOR")}
            >
                Doctor
            </Button>
            <Button
                variant={role === "ADMIN" ? "default" : "outline"}
                onClick={() => set("ADMIN")}
            >
                Administrador
            </Button>
        </div>
    );
}
