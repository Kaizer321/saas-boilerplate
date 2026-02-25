import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { service_id, client_name, client_email, client_phone, notes, starts_at, ends_at, org_id } = body;

        if (!service_id || !client_name || !client_email || !starts_at || !ends_at || !org_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = createSupabaseServiceClient();

        // Verify the org exists
        const { data: org } = await supabase
            .from('organizations')
            .select('id, name')
            .eq('id', org_id)
            .single();

        if (!org) {
            return NextResponse.json(
                { error: 'Organization not found' },
                { status: 404 }
            );
        }

        // Check for time slot conflicts
        const { data: conflicts } = await supabase
            .from('appointments')
            .select('id')
            .eq('org_id', org_id)
            .neq('status', 'cancelled')
            .lt('starts_at', ends_at)
            .gt('ends_at', starts_at);

        if (conflicts && conflicts.length > 0) {
            return NextResponse.json(
                { error: 'This time slot is already booked' },
                { status: 409 }
            );
        }

        // Create the appointment
        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert({
                org_id,
                service_id,
                client_name,
                client_email,
                client_phone: client_phone || null,
                notes: notes || null,
                starts_at,
                ends_at,
                status: 'pending',
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating appointment:', error);
            return NextResponse.json(
                { error: 'Failed to create appointment' },
                { status: 500 }
            );
        }

        // TODO: Send confirmation emails (Phase 3)

        return NextResponse.json({ appointment }, { status: 201 });
    } catch (err) {
        console.error('Booking API error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
