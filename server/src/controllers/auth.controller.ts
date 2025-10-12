// src/controllers/auth.controller.ts
import { Router } from 'express';
import { SupabaseService } from '../auth/supabase.client.ts';
import { validationMiddleware } from '../middleware/validation.middleware.ts';
import { z } from 'zod';
import { authMiddleware } from '../auth/auth.middleware.ts';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

const registerSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, 'Имя пользователя должно быть не менее 3 символов'),
});

// Регистрация
router.post(
  '/register',
  validationMiddleware(registerSchema),
  async (req, res) => {
    try {
      const { email, password, username } = req.body;
      const supabaseService = new SupabaseService();

      const result = await supabaseService.createUser(email, password, {
        username,
      });

      res.status(201).json({
        message: 'Пользователь успешно создан',
        user: result.profile,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Вход
router.post('/login', validationMiddleware(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const supabaseService = new SupabaseService();

    const result = await supabaseService.signIn(email, password);

    res.json({
      message: 'Успешный вход',
      access_token: result.session.access_token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({ error: 'Неверные учетные данные' });
  }
});

// Получение профиля
router.get('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const supabaseService = new SupabaseService();
    const userProfile = await supabaseService.getUserProfile(req.user.id);

    res.json({ user: userProfile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const authController = router;
