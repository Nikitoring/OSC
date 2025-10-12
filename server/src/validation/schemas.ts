import { z } from 'zod';

// Базовые схемы
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive().default(1)),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive().max(100).default(20)),
});

// Схемы для котов
export const createCatSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).trim(),
    description: z.string().max(1000).optional(),
    location: coordinatesSchema,
    health_status: z.enum(['healthy', 'needs_help', 'sick']),
    is_sterilized: z.boolean(),
    is_friendly: z.boolean().optional(),
    characteristics: z.array(z.string()).max(10).default([]),
  }),
});

export const updateCatSchema = createCatSchema.partial();

export const getCatsSchema = z.object({
  query: paginationSchema.extend({
    bounds: z
      .string()
      .optional()
      .transform((str) => (str ? JSON.parse(str) : undefined)),
    health_status: z.string().optional(),
    is_sterilized: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    is_friendly: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
  }),
});

export const catIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Неверный формат ID'),
  }),
});

// Схемы для аутентификации
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Некорректный формат email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  }),
});

export const registerSchema = loginSchema.extend({
  body: loginSchema.shape.body.extend({
    username: z
      .string()
      .min(3, 'Имя пользователя должно содержать минимум 3 символа')
      .max(50, 'Имя пользователя должно содержать максимум 50 символов')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Имя пользователя может содержать только буквы, цифры и подчеркивания'
      ),
  }),
});

// Схемы для пользователей
export const getUsersSchema = z.object({
  query: paginationSchema.extend({
    sort_by: z.enum(['rating', 'cats_count', 'created_at']).default('rating'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(50).optional(),
    avatar_url: z.string().url('Некорректный URL аватара').optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Неверный формат ID пользователя'),
  }),
});

export const getUserCatsSchema = z.object({
  params: userIdSchema.shape.params,
  query: paginationSchema,
});

export const getUserStatsSchema = z.object({
  params: userIdSchema.shape.params,
});

// Схемы для отметок "видел"
export const createSightingSchema = z.object({
  body: z.object({
    cat_id: z.string().uuid('Неверный формат ID кота'),
    location: coordinatesSchema.optional(),
    notes: z.string().max(500).optional(),
  }),
  params: z.object({
    catId: z.string().uuid('Неверный формат ID кота'),
  }),
});
