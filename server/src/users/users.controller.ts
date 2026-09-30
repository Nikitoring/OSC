import { Request, Response } from 'express';
import { UserService } from './users.service.ts';

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
};
