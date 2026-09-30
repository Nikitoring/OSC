import { Router } from 'express';
import { usersController } from './users.controller.ts';

const router = Router();

router.get('/:id', usersController.getUserById);

export { router as usersRoutes };
