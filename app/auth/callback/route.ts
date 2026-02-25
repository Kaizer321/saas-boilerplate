import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';
    const error_description = searchParams.get('error_description');

    // Handle OAuth errors
    if (error_description) {
        return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(error_description)}`
        );
    }

    if (code) {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }

        console.error('Auth callback error:', error.message);
        return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(error.message)}`
        );
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
