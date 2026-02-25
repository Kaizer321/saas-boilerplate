'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Organization } from '@/types';

export function useOrganization() {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createSupabaseBrowserClient();

        async function fetchOrganization() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setLoading(false);
                    return;
                }

                // Get user's org_id from the users table
                const { data: profile } = await supabase
                    .from('users')
                    .select('org_id')
                    .eq('id', user.id)
                    .single();

                if (!profile?.org_id) {
                    setLoading(false);
                    return;
                }

                // Get the organization
                const { data: org, error: orgError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', profile.org_id)
                    .single();

                if (orgError) throw orgError;
                setOrganization(org as Organization);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load organization');
            } finally {
                setLoading(false);
            }
        }

        fetchOrganization();
    }, []);

    return { organization, loading, error };
}
