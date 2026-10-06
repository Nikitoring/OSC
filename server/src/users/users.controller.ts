import { Request, Response } from 'express';
import { UserService } from './users.service.ts';
import { verifySession } from '../utils/sessions.js';

const userService = new UserService();

export const usersController = {
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);

      if (!user) {
        return res.status(404).json({
          error: 'Пользователь не найден',
        });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      const sessionToken = req.cookies.session_id;

      if (!sessionToken) {
        return res.status(401).json({ error: 'No session' });
      }
      const user = await verifySession(sessionToken);
      return res.json({
        ...user,
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
};
