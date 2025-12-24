import { z } from 'zod';

// Schema para autorización de consulta
export const authorizeSchema = z.object({
  codigoSocio: z.string()
    .min(1, 'El número de socio es requerido')
    .regex(/^\d{8}$/, 'El número de socio debe tener 8 dígitos'),
  token: z.string()
    .regex(/^\d{0,3}$/, 'El token debe tener máximo 3 dígitos')
    .optional()
    .or(z.literal('')),
  codigoPrestacion: z.string()
    .min(1, 'El código de prestación es requerido'),
});

export type AuthorizeFormData = z.infer<typeof authorizeSchema>;
