import { Router } from 'express';
import { helpController } from './help.controller.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validation.middleware.ts';
import { createHelpSchema } from './help.schema.ts';

const router = Router();

router.get('/last', helpController.getLast);
router.get('/:catId', helpController.getCatHelp);

router.post(
  '/:catId',
  authenticateToken,
  validateBody(createHelpSchema),
  helpController.createHelp,
);
router.post(
  '/:catId/:type/resolve',
  authenticateToken,
  helpController.resolveHelp,
);

export { router as helpRoutes };
