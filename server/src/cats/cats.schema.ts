import { z } from 'zod';

export const createCatSchema = z.object({
  name: z.string().optional(),

  description: z.string().optional(),

  gender: z.enum(['male', 'female', 'unknown']).optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});
