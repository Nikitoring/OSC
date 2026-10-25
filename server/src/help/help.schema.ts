import { z } from 'zod';

export const createHelpSchema = z.object({
  type: z.enum(['food', 'medical', 'home']),
});

export const helpTypeSchema = z.enum(['food', 'medical', 'home']);

export type HelpType = z.infer<typeof helpTypeSchema>;
