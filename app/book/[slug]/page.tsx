import { Calendar, Clock, MapPin } from 'lucide-react';

interface BookingPageProps {
    params: { slug: string };
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { slug } = params;

    // TODO: Fetch organization by slug
    // TODO: Fetch active services
    // TODO: Fetch availability

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b border-slate-200/60 bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-slate-900 capitalize">{slug.replace(/-/g, ' ')}</span>
                    </div>
                </div>
            </header>

            {/* Booking Content */}
            <main className="container mx-auto px-4 py-12 max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 capitalize">
                        Book with {slug.replace(/-/g, ' ')}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Select a service and choose an available time slot
                    </p>
                </div>

                {/* Services Placeholder */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Services</h2>
                    <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No services available yet.</p>
                        <p className="text-sm text-slate-400 mt-1">
                            This organization hasn&apos;t set up any services.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200/60 bg-white py-6 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        Powered by{' '}
                        <span className="font-medium text-blue-600">BookIt</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}
