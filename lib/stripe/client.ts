import Stripe from 'stripe';

// Guard: Only initialize Stripe if the secret key is available.
// During build or in environments without env vars, this will be null.
export const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        typescript: true,
    })
    : (null as unknown as Stripe);
