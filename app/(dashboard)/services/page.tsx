import { Briefcase, Plus } from 'lucide-react';

export default function ServicesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Services</h1>
                    <p className="text-slate-500 mt-1">Manage the services you offer</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm">
                    <Plus className="h-4 w-4" />
                    Add Service
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="p-12 text-center">
                    <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No services created</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Add your first service to get started with bookings.
                    </p>
                </div>
            </div>
        </div>
    );
}
