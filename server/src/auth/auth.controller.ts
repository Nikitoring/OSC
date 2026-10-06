import { Request, Response } from 'express';
import { AuthService } from './auth.service.ts';

const authService = new AuthService();

export const authController = {
  async registration(req: Request, res: Response) {
    if (!req.body) return res.sendStatus(400);
    const user = await authService.registration(req.body);
    res.status(201).json(user);
  },
  async login(req: Request, res: Response) {
    if (!req.body) return res.sendStatus(400);
    const user = await authService.login(req.body);
    if (user && user.token) {
      res.cookie('session_id', user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      });
    }
    return res
      .status(201)
      .json({ userId: user?.userId, username: user?.username });
  },
};
