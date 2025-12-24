import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Contraseña inválida"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const baseRegisterSchema = z.object({
    firstName: z.string().min(2, "Nombre inválido"),
    lastName: z.string().min(2, "Apellido inválido"),
    email: z.string().email(),
    password: z.string().min(8, "La contraseña debe tener al menos, 8 caracteres 1 mayúscula y 1 número"),
});

export const doctorRegisterSchema = baseRegisterSchema.extend({
    licenseNumber: z.string().min(3, "Matrícula inválida"),
    specialtyId: z.string().uuid("Especialidad inválida"),
    province: z.enum(["Santa Fe", "Buenos Aires"], {
        message: "Debe seleccionar una provincia válida"
    })
});

export const adminRegisterSchema = baseRegisterSchema.extend({
    // clinic_name: z.string().min(2, "Invalid clinic name"),
    // phone: z.string().min(6, "Invalid phone"),
});

export type RegisterDoctorInput = z.infer<typeof doctorRegisterSchema>;
export type RegisterAdminInput = z.infer<typeof adminRegisterSchema>;
