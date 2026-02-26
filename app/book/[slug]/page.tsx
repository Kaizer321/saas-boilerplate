import { Calendar, Clock, DollarSign } from 'lucide-react';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { BookingClient } from './BookingClient';

interface BookingPageProps {
    params: { slug: string };
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { slug } = params;
    const supabase = createSupabaseServiceClient();

    // Fetch organization
    const { data: org } = await supabase
        .from('organizations')
        .select('id, name, slug, timezone')
        .eq('slug', slug)
        .single();

    if (!org) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="text-center">
                    <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900">Organization not found</h1>
                    <p className="text-slate-500 mt-2">The booking page you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    // Fetch services
    const { data: services } = await supabase
        .from('services')
        .select('id, name, description, duration, price, currency, is_active')
        .eq('org_id', org.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    // Fetch availability
    const { data: availability } = await supabase
        .from('availability')
        .select('day_of_week, start_time, end_time, is_active')
        .eq('org_id', org.id)
        .eq('is_active', true)
        .order('day_of_week');

    return (
        <BookingClient
            org={org}
            services={services || []}
            availability={availability || []}
            slug={slug}
        />
    );
}
