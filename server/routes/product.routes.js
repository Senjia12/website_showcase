import { Router } from 'express';
import { brickGetInfo } from '../controllers/product.controllers.js';

const router = Router();

router.route('/:id').get(brickGetInfo);

export default router;