import type { Request, Response, NextFunction } from 'express';
import { verifySession } from '@/utils/sessions.ts';

export type AuthenticatedRequest = Request & {
  user: {
    id: string;
    username: string;
  };
};

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.session_id;

  if (!token) {
    return res.status(401).json({
      error: 'Требуется авторизация',
    });
  }

  try {
    const session = await verifySession(token);

    (req as AuthenticatedRequest).user = {
      id: String(session.userId),
      username: session.username,
    };

    return next();
  } catch {
    res.clearCookie('session_id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.status(401).json({
      error: 'Сессия недействительна или истекла',
    });
  }
}
