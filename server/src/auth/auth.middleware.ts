import type { Request, Response, NextFunction } from 'express';
import { SupabaseService } from './supabase.client.ts';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const token = authHeader.substring(7);
    const supabaseService = new SupabaseService();
    const { user } = await supabaseService.validateToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Невалидный токен' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Ошибка аутентификации' });
  }
};

// Middleware для проверки ролей (если понадобится)
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({ error: 'Недостаточно прав' })
    // }

    next();
  };
};
