import { Router } from 'express';
import { createSession, retrieveSession } from '../controllers/checkout.controllers.js';

const router = Router();

router.post('/', createSession);
router.route('/:id').get(retrieveSession);
// ???
/* The session id placeholder. Put the literal text {CHECKOUT_SESSION_ID} in your return URL, for example ${process.env.CLIENT_URL}/shop.html?session_id={CHECKOUT_SESSION_ID}. Stripe swaps in the real id on redirect, so your result view can read it from the URL and call your status endpoint. */

export default router;