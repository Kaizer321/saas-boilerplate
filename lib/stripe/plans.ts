import type { PlanConfig, Plan } from '@/types';

export const PLANS: Record<Plan, PlanConfig> = {
    free: {
        name: 'Free',
        price: 0,
        stripePriceId: null,
        limits: {
            appointments: 50,
            services: 3,
            teamMembers: 1,
        },
        features: [
            'Basic booking page',
            '3 services',
            '50 appointments/mo',
        ],
    },
    pro: {
        name: 'Pro',
        price: 29,
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
        limits: {
            appointments: 500,
            services: 20,
            teamMembers: 5,
        },
        features: [
            'Custom branding',
            '20 services',
            '500 appointments/mo',
            'Email notifications',
            '5 team members',
        ],
    },
    business: {
        name: 'Business',
        price: 79,
        stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? '',
        limits: {
            appointments: Infinity,
            services: Infinity,
            teamMembers: Infinity,
        },
        features: [
            'Unlimited everything',
            'Priority support',
            'API access',
            'Custom domain',
        ],
    },
};

/**
 * Get plan config by plan name (defaults to free)
 */
export function getPlanConfig(plan: string | null | undefined): PlanConfig {
    return PLANS[(plan as Plan) ?? 'free'] ?? PLANS.free;
}
