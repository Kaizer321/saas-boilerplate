import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your organization settings</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
                {/* Organization Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Organization Name
                    </label>
                    <input
                        type="text"
                        placeholder="Your Organization"
                        className="w-full max-w-md px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Booking Page URL
                    </label>
                    <div className="flex max-w-md">
                        <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg">
                            /book/
                        </span>
                        <input
                            type="text"
                            placeholder="your-org"
                            className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Timezone */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Timezone
                    </label>
                    <select className="w-full max-w-md px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white">
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                </div>

                {/* Save Button */}
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
