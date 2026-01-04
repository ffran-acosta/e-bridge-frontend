import { z } from 'zod';

// Schema para anulación de transacción
export const cancelTransactionSchema = z.object({
  motivo: z.string()
    .optional()
    .or(z.literal('')),
});

export type CancelTransactionFormData = z.infer<typeof cancelTransactionSchema>;




