import { Router } from 'express';
import { catsController } from './cats.controller.ts';
import { validateBody } from '../middleware/validation.middleware.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { createCatSchema } from './cats.schema.ts';

const router = Router();

router.get('/', catsController.getCats);
router.get('/last', catsController.getLastCats);

router.get('/:id', catsController.getCatById);

router.post(
  '/',
  authenticateToken,
  validateBody(createCatSchema),
  catsController.createCat,
);

export { router as catsRoutes };
