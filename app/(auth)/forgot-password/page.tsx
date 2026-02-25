'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Calendar, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createSupabaseBrowserClient();

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
        });

        if (resetError) {
            setError(resetError.message);
            setLoading(false);
            return;
        }

        setSent(true);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            {/* Logo */}
            <div className="text-center">
                <Link href="/" className="inline-flex items-center gap-2">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        BookIt
                    </span>
                </Link>
                <h1 className="mt-6 text-2xl font-semibold text-slate-900">Reset your password</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Enter your email and we&apos;ll send you a reset link
                </p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8">
                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900">Check your email</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                We sent a password reset link to <strong>{email}</strong>
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send reset link'
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Footer */}
            <p className="text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </Link>
            </p>
        </div>
    );
}
