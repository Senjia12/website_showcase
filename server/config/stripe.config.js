import Stripe from 'stripe'; // stripe sdk
// authenticated stripe client instance
export default Stripe(process.env.STRIPE_SECRET_KEY);