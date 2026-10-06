import jwt from 'jsonwebtoken';

export interface SessionPayload {
  userId: string;
  username: string;
}

export async function verifySession(token: string): Promise<SessionPayload> {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as SessionPayload;

    return {
      userId: decoded.userId,
      username: decoded.username,
    };
  } catch (error) {
    throw new Error('Invalid or expired session');
  }
}

export function generateSession(payload: SessionPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
}
