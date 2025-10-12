import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { authController } from './controllers/auth.controller.ts';
import { catsController } from './controllers/cats.controller.ts';
import { usersController } from './controllers/users.controller.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authController);
app.use('/api/cats', catsController);
app.use('/api/users', usersController);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
  }
);

app.listen(PORT, () => {
  console.info(`🚀 Сервер запущен на порту ${PORT}`);
  console.info(`📱 Frontend: ${process.env.FRONTEND_URL}`);
  console.info(`🗄️ Supabase: ${process.env.SUPABASE_URL}`);
});
