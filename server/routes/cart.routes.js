import { Router } from 'express';
import { addToCart, getCart } from '../controllers/cart.controllers.js';

const router = Router();

router.post('/add', addToCart);
router.get('/get', getCart);

export default router;