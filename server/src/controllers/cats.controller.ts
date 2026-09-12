import { Router } from 'express';
import { CatsService } from '../services/cats.service.ts';
import { z } from 'zod';

const router = Router();
const catsService = new CatsService();

const createCatSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  description: z.string().optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  location: z
    .string()
    .transform((str, ctx) => {
      try {
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

export const catsController = router;
