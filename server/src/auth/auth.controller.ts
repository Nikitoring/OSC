import { Router } from 'express';
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
    res.status(201).json(user);
  },
};
