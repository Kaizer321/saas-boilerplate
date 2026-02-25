// Types
export type Plan = 'free' | 'pro' | 'business';
export type OrgRole = 'owner' | 'admin' | 'member';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    timezone: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    plan: Plan;
    plan_status: string;
    created_at: string;
}

export interface User {
    id: string;
    org_id: string;
    full_name: string;
    avatar_url: string | null;
    role: OrgRole;
    created_at: string;
}

export interface Service {
    id: string;
    org_id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number | null;
    currency: string;
    is_active: boolean;
    created_at: string;
}

export interface Appointment {
    id: string;
    org_id: string;
    service_id: string;
    client_name: string;
    client_email: string;
    client_phone: string | null;
    notes: string | null;
    starts_at: string;
    ends_at: string;
    status: AppointmentStatus;
    created_at: string;
    services?: Pick<Service, 'name' | 'duration'>;
}

export interface Availability {
    id: string;
    org_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface Invitation {
    id: string;
    org_id: string;
    email: string;
    role: OrgRole;
    token: string;
    expires_at: string;
    accepted_at: string | null;
    created_at: string;
}

export interface PlanConfig {
    name: string;
    price: number;
    stripePriceId: string | null;
    limits: {
        appointments: number;
        services: number;
        teamMembers: number;
    };
    features: string[];
}
