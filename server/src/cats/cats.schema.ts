import { z } from "zod";

export const createCatSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((name) => name || undefined),
  description: z.string().optional(),
  gender: z.enum(["male", "female", "unknown"]).optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export const updateCatSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Кличка не должна быть пустой")
      .max(255)
      .optional(),
    description: z.string().nullable().optional(),
    gender: z.enum(["male", "female", "unknown"]).optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
  })
  .refine(
    (data) =>
      (data.latitude === undefined && data.longitude === undefined) ||
      (data.latitude !== undefined && data.longitude !== undefined),
    { message: "Широта и долгота должны передаваться вместе" },
  );
