import { Router } from 'express';
import { brickGetInfo, createBrick } from '../controllers/brick.controllers.js';

const router = Router();

router.route('/:id').get(brickGetInfo);
router.route('/:name').post(createBrick);

export default router;