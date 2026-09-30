import { Router } from 'express';
import { authController } from './auth.controller.ts';
import { validateBody } from '../middleware/validation.middleware.ts';
import { registrationSchema } from './registration.schema.js';

const router = Router();

router.post(
  '/registration',
  validateBody(registrationSchema),
  authController.registration,
);

router.post('/login', validateBody(registrationSchema), authController.login);

export { router as authRoutes };
