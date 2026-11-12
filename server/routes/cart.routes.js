import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controllers.js';

const router = Router();

router.post('/add', addToCart);
router.get('/get', getCart);
router.post('/remove', removeFromCart);

export default router;