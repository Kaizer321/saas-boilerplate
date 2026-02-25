import { Users, UserPlus } from 'lucide-react';

export default function TeamPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team</h1>
                    <p className="text-slate-500 mt-1">Manage your team members</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm">
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                {/* Owner row */}
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Y</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">You (Owner)</p>
                            <p className="text-xs text-slate-500">owner@example.com</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                        Owner
                    </span>
                </div>
            </div>
        </div>
    );
}
