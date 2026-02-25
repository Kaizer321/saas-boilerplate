'use client';

import { useOrganization } from './useOrganization';
import { PLANS } from '@/lib/stripe/plans';
import type { Plan } from '@/types';

export function useSubscription() {
    const { organization, loading } = useOrganization();
    const plan = PLANS[(organization?.plan as Plan) ?? 'free'] ?? PLANS.free;

    return {
        plan,
        planName: organization?.plan ?? 'free',
        loading,
        canInviteMembers: (currentCount: number) => currentCount < plan.limits.teamMembers,
        canAddService: (currentCount: number) => currentCount < plan.limits.services,
        canCreateAppointment: (currentCount: number) => currentCount < plan.limits.appointments,
        isProOrAbove: ['pro', 'business'].includes(organization?.plan ?? ''),
        isBusiness: organization?.plan === 'business',
    };
}
