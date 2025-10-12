// src/controllers/cats.controller.ts
import { Router } from 'express';
import { authMiddleware, type AuthRequest } from '../auth/auth.middleware.ts';
import { CatsService } from '../services/cats.service.ts';
// import { uploadMiddleware } from '../middleware/upload.middleware';
import { validationMiddleware } from '../middleware/validation.middleware.ts';
import { z } from 'zod';

const router = Router();
const catsService = new CatsService();

const createCatSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  description: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  health_status: z.enum(['healthy', 'needs_help', 'sick']),
  is_sterilized: z.boolean(),
  is_friendly: z.boolean().optional(),
  characteristics: z.array(z.string()).default([]),
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
  // uploadMiddleware.array('photos', 5),
  validationMiddleware(createCatSchema),
  async (req: AuthRequest, res) => {
    try {
      const catData = req.body;
      const photos = req.files as Express.Multer.File[];

      const cat = await catsService.createCat(
        {
          ...catData,
          created_by: req.user.id,
        },
        photos
      );

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
  validationMiddleware(createCatSchema.partial()),
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
