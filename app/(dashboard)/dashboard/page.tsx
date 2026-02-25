import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar, Briefcase, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here&apos;s an overview of your business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Appointments"
                    value={0}
                    description="This month"
                    icon={Calendar}
                    trend={{ value: 0, isPositive: true }}
                />
                <StatsCard
                    title="Active Services"
                    value={0}
                    icon={Briefcase}
                />
                <StatsCard
                    title="Team Members"
                    value={1}
                    icon={Users}
                />
                <StatsCard
                    title="Booking Rate"
                    value="0%"
                    description="Conversion"
                    icon={TrendingUp}
                />
            </div>

            {/* Recent Appointments (placeholder) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="p-6 border-b border-slate-200/60">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Appointments</h2>
                    <p className="text-sm text-slate-500 mt-1">Your latest bookings</p>
                </div>
                <div className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No appointments yet</p>
                    <p className="text-sm text-slate-400 mt-1">Appointments will appear here once clients start booking.</p>
                </div>
            </div>
        </div>
    );
}
