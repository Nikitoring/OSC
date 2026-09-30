import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type AuthenticatedRequest = Request & {
  user: {
    id: string | number;
  };
};

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    req.user = {
      id: payload.userId,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};
