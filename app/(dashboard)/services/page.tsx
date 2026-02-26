'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Briefcase, Plus, X, Loader2, Pencil, Trash2, DollarSign, Clock, AlertCircle } from 'lucide-react';
import type { Service } from '@/types';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Service | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [orgId, setOrgId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('30');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('USD');

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Get current user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setError('Not authenticated. Please log in.');
                    setLoading(false);
                    return;
                }

                // 2. Get or create user profile + org
                let userOrgId: string | null = null;

                const { data: profile } = await supabase
                    .from('users')
                    .select('org_id')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    userOrgId = profile.org_id;
                } else {
                    // Signup trigger may have failed — create org + profile
                    console.log('No user profile found. Creating org and profile...');

                    const orgName = user.user_metadata?.org_name || user.email?.split('@')[0] || 'My Org';
                    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                    const { data: newOrg, error: orgErr } = await supabase
                        .from('organizations')
                        .insert({
                            name: orgName,
                            slug: slug + '-' + Date.now().toString(36),
                            timezone: 'UTC',
                            plan: 'free',
                            plan_status: 'active',
                        })
                        .select('id')
                        .single();

                    if (orgErr || !newOrg) {
                        setError(`Could not create organization: ${orgErr?.message}`);
                        setLoading(false);
                        return;
                    }

                    await supabase.from('users').insert({
                        id: user.id,
                        org_id: newOrg.id,
                        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                        role: 'owner',
                    });

                    userOrgId = newOrg.id;
                }

                setOrgId(userOrgId);

                // 3. Fetch services for this org
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*')
                    .eq('org_id', userOrgId)
                    .order('created_at', { ascending: false });

                setServices(servicesData || []);
            } catch (err) {
                setError('Something went wrong loading services.');
                console.error(err);
            }
            setLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshServices = async () => {
        if (!orgId) return;
        const { data } = await supabase
            .from('services')
            .select('*')
            .eq('org_id', orgId)
            .order('created_at', { ascending: false });
        setServices(data || []);
    };

    const openCreate = () => {
        setEditing(null);
        setName('');
        setDescription('');
        setDuration('30');
        setPrice('');
        setCurrency('USD');
        setError(null);
        setShowModal(true);
    };

    const openEdit = (s: Service) => {
        setEditing(s);
        setName(s.name);
        setDescription(s.description || '');
        setDuration(String(s.duration));
        setPrice(s.price !== null ? String(s.price) : '');
        setCurrency(s.currency);
        setError(null);
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const payload = {
            name,
            description: description || null,
            duration: parseInt(duration),
            price: price ? parseFloat(price) : null,
            currency,
            is_active: true,
        };

        if (editing) {
            const { error: err } = await supabase.from('services').update(payload).eq('id', editing.id);
            if (err) {
                setError(`Update failed: ${err.message}`);
                setSaving(false);
                return;
            }
        } else {
            const { error: err } = await supabase.from('services').insert({ ...payload, org_id: orgId });
            if (err) {
                setError(`Create failed: ${err.message}`);
                setSaving(false);
                return;
            }
        }

        setSaving(false);
        setShowModal(false);
        await refreshServices();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        setDeleting(id);
        await supabase.from('services').delete().eq('id', id);
        setDeleting(null);
        await refreshServices();
    };

    const toggleActive = async (s: Service) => {
        await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id);
        await refreshServices();
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Services</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage the services you offer</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Add Service
                </button>
            </div>

            {/* Error banner */}
            {error && (
                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-200 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">Error</p>
                        <p className="mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center">
                    <Loader2 className="h-8 w-8 text-blue-500 mx-auto animate-spin" />
                </div>
            ) : services.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="p-12 text-center">
                        <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No services created</p>
                        <p className="text-sm text-slate-400 mt-1">Add your first service to get started with bookings.</p>
                        <button
                            onClick={openCreate}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Create a service
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((s) => (
                        <div
                            key={s.id}
                            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${s.is_active ? 'border-slate-200/60' : 'border-slate-200/40 opacity-60'}`}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">{s.name}</h3>
                                        {s.description && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => toggleActive(s)}
                                        className={`ml-3 shrink-0 w-10 h-6 rounded-full transition-colors relative ${s.is_active ? 'bg-green-500' : 'bg-slate-300'}`}
                                    >
                                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${s.is_active ? 'left-[18px]' : 'left-0.5'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {s.duration} min
                                    </span>
                                    {s.price !== null && (
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            {s.price} {s.currency}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex border-t border-slate-100">
                                <button
                                    onClick={() => openEdit(s)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                </button>
                                <div className="w-px bg-slate-100" />
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    disabled={deleting === s.id}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    {deleting === s.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editing ? 'Edit Service' : 'Add Service'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100 mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Haircut, Consultation"
                                    required
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of the service"
                                    rows={2}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (min)</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                                    >
                                        {[15, 30, 45, 60, 90, 120].map((m) => (
                                            <option key={m} value={m}>{m} min</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00 (free)"
                                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                                    ) : (
                                        editing ? 'Update' : 'Create Service'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
