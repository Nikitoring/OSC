// src/controllers/cats.controller.ts
import { Router } from 'express';
import { authMiddleware, type AuthRequest } from '../auth/auth.middleware.ts';
import { CatsService } from '../services/cats.service.ts';
import { uploadMiddleware } from '../middleware/upload.middleware.ts';
import { validateBody } from '../middleware/validation.middleware.ts';
import { z } from 'zod';

const router = Router();
const catsService = new CatsService();

const createCatSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  description: z.string().optional(),
  location: z
    .string()
    .transform((str, ctx) => {
      try {
        console.log('str');
        const parsed = JSON.parse(str);
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'latitude' in parsed &&
          'longitude' in parsed
        ) {
          return parsed;
        }
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Location must be an object with latitude and longitude',
        });
        return z.NEVER;
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Location must be a valid JSON string',
        });
        return z.NEVER;
      }
    })
    .optional(),
  health_status: z.enum(['healthy', 'needs_help', 'sick']),
  is_sterilized: z
    .string()
    .transform((srt, ctx) => {
      const parsed = srt === 'true' ? true : srt === 'false' ? false : null;
      if (parsed === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'is_sterilized must be a boolean string',
        });
        return z.NEVER;
      }
      return parsed;
    })
    .optional(),
  is_friendly: z
    .string()
    .transform((srt, ctx) => {
      const parsed = srt === 'true' ? true : srt === 'false' ? false : null;
      if (parsed === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'is_sterilized must be a boolean string',
        });
        return z.NEVER;
      }
      return parsed;
    })
    .optional(),
  characteristics: z.string().optional(),
});

// Получить всех котов (с пагинацией и фильтрами)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, bounds, ...filters } = req.query;

    const cats = await catsService.getCats({
      page: Number(page),
      limit: Number(limit),
      bounds: bounds ? JSON.parse(bounds as string) : undefined,
      filters,
    });

    res.json(cats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить кота по ID
router.get('/:id', async (req, res) => {
  try {
    const cat = await catsService.getCatById(req.params.id);

    if (!cat) {
      return res.status(404).json({ error: 'Кот не найден' });
    }

    res.json(cat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить кота (требуется авторизация)
router.post(
  '/',
  authMiddleware,
  uploadMiddleware.array('photos', 5),
  validateBody(createCatSchema),
  async (req, res) => {
    try {
      const catData = req.body;
      const photos = req.files as Express.Multer.File[];
      console.log('controller photos', photos);
      const userToken = req.headers.authorization?.replace('Bearer ', '');

      if (!userToken) {
        return res.status(401).json({ error: 'Токен пользователя не найден' });
      }
      const cat = await catsService.createCat(
        {
          ...catData,
          created_by: req.user.id,
        },
        photos,
        userToken
      );
      if (cat.error) {
        res.status(400).json(cat);
        return;
      }
      res.status(201).json(cat);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Обновить кота (только создатель)
router.put(
  '/:id',
  authMiddleware,
  // uploadMiddleware.array('photos', 5),
  validateBody(createCatSchema.partial()),
  async (req: AuthRequest, res) => {
    try {
      const cat = await catsService.updateCat(
        req.params.id,
        req.user.id,
        req.body,
        req.files as Express.Multer.File[]
      );

      res.json(cat);
    } catch (error: any) {
      if (error.message === 'Недостаточно прав') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
);

// Удалить кота (только создатель)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await catsService.deleteCat(req.params.id, req.user.id);

    res.json({ message: 'Кот успешно удален' });
  } catch (error: any) {
    if (error.message === 'Недостаточно прав') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

export const catsController = router;
