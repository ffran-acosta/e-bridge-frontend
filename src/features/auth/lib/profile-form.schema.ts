import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
        .union([
            z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
            z.literal(""),
        ])
        .optional(),
    licenseNumber: z.string().min(3, "La matrícula debe tener al menos 3 caracteres"),
    specialtyId: z.string().uuid("Especialidad inválida"),
    province: z.enum(["Santa Fe", "Buenos Aires"], {
        errorMap: () => ({ message: "Debe seleccionar una provincia válida" })
    }).optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
