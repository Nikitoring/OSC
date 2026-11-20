import { Response } from 'express';
import { UserService } from './users.service.ts';
import { verifySession } from '@/utils/sessions.js';

const userService = new UserService();

export const usersController = {
  async getMe(req: Request, res: Response) {
    const sessionToken = req.cookies?.session_id;
    if (!sessionToken) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    try {
      return res.json(await verifySession(sessionToken));
    } catch (error) {
      console.error('GET /api/users/me: invalid session', error);
      return res.status(401).json({ error: 'Сессия недействительна или истекла' });
    }
  },

  async getUserById(req: Request, res: Response) {
    const id = req.params.id;
    if (!/^\d{1,19}$/.test(id) || BigInt(id) > 9223372036854775807n) {
      return res.status(400).json({ error: 'Некорректный ID пользователя' });
    }

    try {
      const user = await userService.getProfile(id);

      if (!user) {
        return res.status(404).json({
          error: 'Пользователь не найден',
        });
      }

      res.json(user);
    } catch (error) {
      console.error('GET /api/users/:id failed', error);
      res.status(500).json({ error: 'Не удалось загрузить профиль пользователя' });
    }
  },
};
