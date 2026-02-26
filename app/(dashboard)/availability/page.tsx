'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Clock, Loader2, Save } from 'lucide-react';
import type { Availability } from '@/types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        TIME_OPTIONS.push(`${hour}:${min}`);
    }
}

function formatTime(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

interface DaySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    id?: string;
}

const DEFAULT_SLOTS: DaySlot[] = DAYS.map((_, i) => ({
    day_of_week: i,
    start_time: '09:00',
    end_time: '17:00',
    is_active: i >= 1 && i <= 5, // Mon-Fri active
}));

export default function AvailabilityPage() {
    const [slots, setSlots] = useState<DaySlot[]>(DEFAULT_SLOTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [orgId, setOrgId] = useState<string | null>(null);

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const init = async () => {
            // Get org_id
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('org_id')
                    .eq('id', user.id)
                    .single();
                if (profile) setOrgId(profile.org_id);
            }

            // Get existing availability
            const { data } = await supabase
                .from('availability')
                .select('*')
                .order('day_of_week', { ascending: true });

            if (data && data.length > 0) {
                const merged = DEFAULT_SLOTS.map((def) => {
                    const existing = data.find((d: Availability) => d.day_of_week === def.day_of_week);
                    return existing
                        ? { ...def, ...existing }
                        : def;
                });
                setSlots(merged);
            }
            setLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateSlot = (index: number, field: keyof DaySlot, value: string | boolean) => {
        setSlots((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
        );
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);

        for (const slot of slots) {
            const payload = {
                day_of_week: slot.day_of_week,
                start_time: slot.start_time,
                end_time: slot.end_time,
                is_active: slot.is_active,
            };

            if (slot.id) {
                await supabase.from('availability').update(payload).eq('id', slot.id);
            } else {
                const { data } = await supabase.from('availability').insert({ ...payload, org_id: orgId }).select('id').single();
                if (data) slot.id = data.id;
            }
        }

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
                    <p className="text-slate-500 mt-1 text-sm">Set your working hours for each day of the week</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm disabled:opacity-50"
                >
                    {saving ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                    ) : saved ? (
                        <><Save className="h-4 w-4" /> Saved!</>
                    ) : (
                        <><Save className="h-4 w-4" /> Save Changes</>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                {/* Desktop header */}
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-3 bg-slate-50/80 border-b border-slate-200/60 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    <span>Day</span>
                    <span className="w-36 text-center">Start</span>
                    <span className="w-36 text-center">End</span>
                    <span className="w-16 text-center">Active</span>
                </div>

                <div className="divide-y divide-slate-200/60">
                    {slots.map((slot, index) => (
                        <div
                            key={slot.day_of_week}
                            className={`px-4 sm:px-6 py-4 transition-colors ${slot.is_active ? '' : 'bg-slate-50/50'}`}
                        >
                            {/* Mobile layout */}
                            <div className="flex items-center justify-between sm:hidden mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${slot.is_active ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span className="text-sm font-semibold text-slate-900">{SHORT_DAYS[index]}</span>
                                </div>
                                <button
                                    onClick={() => updateSlot(index, 'is_active', !slot.is_active)}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${slot.is_active ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${slot.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                                </button>
                            </div>
                            {slot.is_active && (
                                <div className="flex gap-3 sm:hidden">
                                    <select
                                        value={slot.start_time}
                                        onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        {TIME_OPTIONS.map((t) => (
                                            <option key={t} value={t}>{formatTime(t)}</option>
                                        ))}
                                    </select>
                                    <span className="flex items-center text-slate-400 text-sm">to</span>
                                    <select
                                        value={slot.end_time}
                                        onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        {TIME_OPTIONS.map((t) => (
                                            <option key={t} value={t}>{formatTime(t)}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {!slot.is_active && (
                                <p className="text-xs text-slate-400 sm:hidden">Closed</p>
                            )}

                            {/* Desktop layout */}
                            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${slot.is_active ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <span className="text-sm font-medium text-slate-900">{DAYS[index]}</span>
                                </div>

                                {slot.is_active ? (
                                    <>
                                        <select
                                            value={slot.start_time}
                                            onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                                            className="w-36 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        >
                                            {TIME_OPTIONS.map((t) => (
                                                <option key={t} value={t}>{formatTime(t)}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={slot.end_time}
                                            onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                                            className="w-36 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        >
                                            {TIME_OPTIONS.map((t) => (
                                                <option key={t} value={t}>{formatTime(t)}</option>
                                            ))}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-36 text-center text-sm text-slate-400">—</span>
                                        <span className="w-36 text-center text-sm text-slate-400">Closed</span>
                                    </>
                                )}

                                <div className="w-16 flex justify-center">
                                    <button
                                        onClick={() => updateSlot(index, 'is_active', !slot.is_active)}
                                        className={`w-11 h-6 rounded-full transition-colors relative ${slot.is_active ? 'bg-green-500' : 'bg-slate-300'}`}
                                    >
                                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${slot.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-500 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p>
                    These hours define when clients can book appointments. Times shown are in your
                    organization&apos;s timezone. Don&apos;t forget to click <strong>Save Changes</strong> after editing.
                </p>
            </div>
        </div>
    );
}
