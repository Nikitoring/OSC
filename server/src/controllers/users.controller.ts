import { Router } from 'express';
import { authMiddleware, type AuthRequest } from '../auth/auth.middleware.ts';
import { UsersService } from '../services/users.service.ts';
import { validationMiddleware } from '../middleware/validation.middleware.ts';
import {
  updateProfileSchema,
  userIdSchema,
  getUsersSchema,
} from '../validation/schemas.ts';

const router = Router();
const usersService = new UsersService();

// Получить профиль текущего пользователя
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await usersService.getUserById(req.user.id);
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить профиль текущего пользователя
router.put(
  '/me',
  authMiddleware,
  validationMiddleware(updateProfileSchema),
  async (req: AuthRequest, res) => {
    try {
      const { body } = req.validatedData;
      const user = await usersService.updateUser(req.user.id, body);
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Получить пользователя по ID
router.get('/:id', validationMiddleware(userIdSchema), async (req, res) => {
  try {
    const { params } = req.validatedData;
    const user = await usersService.getUserById(params.id);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Не возвращаем чувствительные данные
    const { email, ...publicUser } = user;
    res.json({ user: publicUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить список пользователей (с рейтингом)
router.get('/', validationMiddleware(getUsersSchema), async (req, res) => {
  try {
    const { query } = req.validatedData;
    const result = await usersService.getUsers(query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить котов пользователя
router.get(
  '/:id/cats',
  validationMiddleware(userIdSchema),
  async (req, res) => {
    try {
      const { params } = req.validatedData;
      const { page = 1, limit = 20 } = req.query;

      const cats = await usersService.getUserCats(
        params.id,
        Number(page),
        Number(limit)
      );

      res.json(cats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Получить статистику пользователя
router.get(
  '/:id/stats',
  validationMiddleware(userIdSchema),
  async (req, res) => {
    try {
      const { params } = req.validatedData;
      const stats = await usersService.getUserStats(params.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Удалить аккаунт (только свой)
router.delete('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await usersService.deleteUser(req.user.id);
    res.json({ message: 'Аккаунт успешно удален' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const usersController = router;
