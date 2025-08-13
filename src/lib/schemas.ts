import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const baseRegisterSchema = z.object({
    full_name: z.string().min(2, "Too short"),
    email: z.string().email(),
    password: z.string().min(6),
});

export const doctorRegisterSchema = baseRegisterSchema.extend({
    license_number: z.string().min(3, "Invalid license"),
    specialty: z.string().min(2, "Invalid specialty"),
});

export const adminRegisterSchema = baseRegisterSchema.extend({
    clinic_name: z.string().min(2, "Invalid clinic name"),
    phone: z.string().min(6, "Invalid phone"),
});

export type RegisterDoctorInput = z.infer<typeof doctorRegisterSchema>;
export type RegisterAdminInput = z.infer<typeof adminRegisterSchema>;
