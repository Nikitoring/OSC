import type { Request, Response } from 'express';
import { AuthService } from './auth.service.ts';
import { generateSession } from '@/utils/sessions.ts';

const authService = new AuthService();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setSessionCookie(
  res: Response,
  user: { id: string | number; username: string },
) {
  const token = generateSession({
    userId: String(user.id),
    username: user.username,
  });

  res.cookie('session_id', token, cookieOptions);
}

export const authController = {
  async checkLoginAvailability(req: Request, res: Response) {
    const login = String(req.query.login ?? '').trim();
    if (login.length < 3 || login.length > 100) {
      return res.status(400).json({ error: 'Логин должен содержать от 3 до 100 символов' });
    }
    return res.json({ available: await authService.isLoginAvailable(login) });
  },

  async registration(req: Request, res: Response) {
    let user;
    try {
      user = await authService.registration(req.body);
    } catch (error) {
      if (error instanceof Error && error.name === 'LoginAlreadyTakenError') {
        return res.status(409).json({ error: error.message });
      }
      throw error;
    }

    setSessionCookie(res, user);

    return res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
      },
    });
  },

  async login(req: Request, res: Response) {
    const user = await authService.login(req.body);

    if (!user) {
      return res.status(401).json({
        error: 'Неверный логин или пароль',
      });
    }
    setSessionCookie(res, user);

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
      },
    });
  },

  logout(_req: Request, res: Response) {
    res.clearCookie('session_id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.sendStatus(204);
  },
};
