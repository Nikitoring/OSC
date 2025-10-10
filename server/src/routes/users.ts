// routes/cats.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const router = Router();

router.get('/', UserController.getAllCats);
router.get('/:id', UserController.getCat);
router.post('/', UserController.createCat);
router.put('/:id', UserController.updateCat);
router.delete('/:id', UserController.deleteCat);

export default router;
