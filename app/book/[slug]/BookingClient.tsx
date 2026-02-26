'use client';

import { Calendar, Clock, DollarSign } from 'lucide-react';
import { ChatWidget } from '@/components/booking/ChatWidget';

interface Service {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number | null;
    currency: string;
    is_active: boolean;
}

interface Availability {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

interface BookingClientProps {
    org: { id: string; name: string; slug: string; timezone: string };
    services: Service[];
    availability: Availability[];
    slug: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function BookingClient({ org, services, availability, slug }: BookingClientProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-slate-900">{org.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{org.timezone}</span>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
                <div className="text-center mb-8 sm:mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                        <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Book with {org.name}
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base">
                        Select a service and choose an available time slot
                    </p>
                </div>

                {/* Services */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Services</h2>
                    {services.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 text-center">
                            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No services available yet.</p>
                            <p className="text-sm text-slate-400 mt-1">
                                This organization hasn&apos;t set up any services.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {services.map((s) => (
                                <div
                                    key={s.id}
                                    className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                        {s.name}
                                    </h3>
                                    {s.description && (
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            {s.duration} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4 text-green-500" />
                                            {s.price !== null ? `${s.price} ${s.currency}` : 'Free'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Working Hours */}
                {availability.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Working Hours</h2>
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm divide-y divide-slate-100 overflow-hidden">
                            {availability.map((a) => (
                                <div key={a.day_of_week} className="flex items-center justify-between px-5 py-3">
                                    <span className="text-sm font-medium text-slate-700">
                                        {DAY_NAMES[a.day_of_week]}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {formatTime(a.start_time)} — {formatTime(a.end_time)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI hint */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-700">
                        💬 Need help choosing? Click the <strong>chat bubble</strong> in the bottom-right corner to talk to our AI assistant!
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200/60 bg-white py-6 mt-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        Powered by{' '}
                        <span className="font-medium text-blue-600">BookIt</span>
                    </p>
                </div>
            </footer>

            {/* AI Chat Widget */}
            <ChatWidget slug={slug} orgName={org.name} />
        </div>
    );
}
