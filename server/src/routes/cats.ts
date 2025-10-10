// routes/cats.ts
import { Router } from 'express';
import { CatController } from '../controllers/catController.ts';
import { authenticateToken } from '../middleware/auth';
const router = Router();

router.use(authenticateToken);

router.get('/', CatController.getAllCats);
router.get('/:id', CatController.getCat);
router.post('/', CatController.createCat);
router.put('/:id', CatController.updateCat);
router.delete('/:id', CatController.deleteCat);

export default router;
