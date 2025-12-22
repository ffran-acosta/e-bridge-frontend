import { z } from 'zod';

// Schema para autorización de consulta
export const authorizeSchema = z.object({
  codigoSocio: z.string()
    .min(1, 'El número de socio es requerido')
    .regex(/^\d{8}$/, 'El número de socio debe tener 8 dígitos'),
  token: z.string()
    .min(1, 'El token es requerido')
    .regex(/^\d{3}$/, 'El token debe tener 3 dígitos'),
  tipoConsulta: z.string()
    .min(1, 'El tipo de consulta es requerido'),
});

export type AuthorizeFormData = z.infer<typeof authorizeSchema>;
