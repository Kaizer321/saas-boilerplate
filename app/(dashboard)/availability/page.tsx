import { Clock } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
                <p className="text-slate-500 mt-1">Set your working hours for each day of the week</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm divide-y divide-slate-200/60">
                {DAYS.map((day, index) => (
                    <div key={day} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${index >= 1 && index <= 5 ? 'bg-green-500' : 'bg-slate-300'}`} />
                            <span className="text-sm font-medium text-slate-900">{day}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                            {index >= 1 && index <= 5 ? '9:00 AM — 5:00 PM' : 'Closed'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
