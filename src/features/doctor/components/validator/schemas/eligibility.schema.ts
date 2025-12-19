import { z } from 'zod';

// Schema base para validación de eligibilidad
// Este schema se puede extender para autorización agregando más campos
export const eligibilitySchema = z.object({
  codigoSocio: z.string()
    .min(1, 'El número de socio es requerido')
    .regex(/^\d{8}$/, 'El número de socio debe tener 8 dígitos'),
});

export type EligibilityFormData = z.infer<typeof eligibilitySchema>;
