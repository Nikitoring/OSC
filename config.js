import { config } from 'dotenv';
config();

export const port = process.env.PORT || 3000;
export const dbUser = process.env.DB_USER || 'example';
export const dbPass = process.env.DB_PASS || 'example';
export const dbURI = process.env.DB_URI;
export const PROD = process.env.NODE_ENV
export const SECRET_KEY = process.env.SECRET_KEY