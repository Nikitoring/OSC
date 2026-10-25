import { Router } from 'express';
import { usersController } from './users.controller.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = Router();

router.get('/me', authenticateToken, usersController.getMe);

router.get('/:id', usersController.getUserById);

export { router as usersRoutes };
