import { Router } from 'express';
import { brickGetInfo, createBrick, getAllBricks, updateBrick } from '../controllers/brick.controllers.js';

const router = Router();

router.post('/', createBrick);
router.route('/all').get(getAllBricks);
router.route('/:idOrName').patch(updateBrick)
router.route('/:idOrName').get(brickGetInfo);

export default router;