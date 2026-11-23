import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controllers.js';

const router = Router();

// gotta rework that to respect rest conventions
router.post('/add', addToCart);
router.get('/:id', getCart);
router.post('/remove', removeFromCart);

export default router;