import { z } from 'zod';

export const createCatSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((name) => name || undefined),
  description: z.string().optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});
