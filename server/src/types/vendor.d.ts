declare module 'bcrypt' {
  const bcrypt: {
    hash(value: string, rounds: number): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
  };

  export default bcrypt;
}

declare module 'cookie-parser' {
  import type { RequestHandler } from 'express';

  const cookieParser: (secret?: string) => RequestHandler;
  export default cookieParser;
}

declare module 'jsonwebtoken' {
  type SignOptions = { expiresIn?: string | number };

  const jwt: {
    verify(token: string, secret: string): unknown;
    sign(payload: object, secret: string, options?: SignOptions): string;
  };

  export default jwt;
}

declare module 'morgan' {
  import type { RequestHandler } from 'express';

  const morgan: (format: string) => RequestHandler;
  export default morgan;
}

declare namespace Express {
  interface Request {
    cookies?: Record<string, string>;
  }
}
