import { Calendar } from 'lucide-react';

export default function AppointmentsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                    <p className="text-slate-500 mt-1">Manage all your appointments</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No appointments yet</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Share your booking page to start receiving appointments.
                    </p>
                </div>
            </div>
        </div>
    );
}
