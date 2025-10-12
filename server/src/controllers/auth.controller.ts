// src/controllers/auth.controller.ts
import { Router } from 'express';
import { SupabaseService } from '../auth/supabase.client.ts';
import { validateBody } from '../middleware/validation.middleware.ts';
import { z } from 'zod';
import { authMiddleware, type AuthRequest } from '../auth/auth.middleware.ts';

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

export const silentRefreshSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1, 'Refresh token обязателен'),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    access_token: z.string().min(1, 'Access token обязателен'),
  }),
});

router.get('/init', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const supabaseService = new SupabaseService();

    // Получаем актуальные данные пользователя
    const userProfile = await supabaseService.getUserProfile(req.user.id);

    res.json({
      success: true,
      user: userProfile,
      isAuthenticated: true,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Токен невалиден или истек',
      isAuthenticated: false,
    });
  }
});

// Тихая авторизация (обновление токена)
router.post('/silent-refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    const supabaseService = new SupabaseService();
    const result = await supabaseService.refreshSession(refresh_token);

    res.json({
      success: true,
      access_token: result.session.access_token,
      refresh_token: result.session.refresh_token,
      expires_at: result.session?.expires_at,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Не удалось обновить токен',
      isAuthenticated: false,
    });
  }
});

// Регистрация
router.post('/register', validateBody(registerSchema), async (req, res) => {
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
});

// Вход
router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const supabaseService = new SupabaseService();

    const result = await supabaseService.signIn(email, password);

    res.json({
      message: 'Успешный вход',
      access_token: result.session.access_token,
      refresh_token: result.session.refresh_token,
      expires_at: result.session?.expires_at,
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
