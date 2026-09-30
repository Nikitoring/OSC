import { z } from 'zod';

export const registrationSchema = z.object({
  login: z.string().min(3).max(100),
  password: z.string().min(8),
});
