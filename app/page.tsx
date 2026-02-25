import Link from 'next/link';
import { Calendar, Shield, Zap, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b border-slate-200/60 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between h-16 px-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-7 w-7 text-blue-600" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            BookIt
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                            Pricing
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="container mx-auto px-4 pt-20 pb-32 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-blue-100">
                    <Zap className="h-4 w-4" />
                    Multi-tenant SaaS Boilerplate
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                    Appointment booking
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        made effortless
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Set up your services, define availability, and share a beautiful booking page
                    with your clients. All in minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Start Free Trial
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                        href="#features"
                        className="inline-flex items-center gap-2 text-slate-700 font-medium px-8 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                    >
                        Learn More
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="container mx-auto px-4 py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
                    Everything you need
                </h2>
                <p className="text-slate-600 text-center mb-16 max-w-xl mx-auto">
                    A complete appointment booking platform with multi-tenancy, billing, and team management built in.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Calendar,
                            title: 'Smart Scheduling',
                            description: 'Set working hours, define services with durations, and let clients book available slots automatically.',
                        },
                        {
                            icon: Shield,
                            title: 'Multi-Tenant Security',
                            description: 'Row Level Security ensures complete data isolation. Each organization is a fully independent tenant.',
                        },
                        {
                            icon: Zap,
                            title: 'Instant Setup',
                            description: 'Sign up, create your organization, add services, and share your booking link — all in under 5 minutes.',
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5">
                                <feature.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="container mx-auto px-4 py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
                    Simple, transparent pricing
                </h2>
                <p className="text-slate-600 text-center mb-16 max-w-xl mx-auto">
                    Start free. Upgrade when you need more power.
                </p>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            name: 'Free',
                            price: '$0',
                            description: 'Perfect for getting started',
                            features: ['Basic booking page', '3 services', '50 appointments/mo'],
                            cta: 'Get Started',
                            highlight: false,
                        },
                        {
                            name: 'Pro',
                            price: '$29',
                            description: 'For growing businesses',
                            features: ['Custom branding', '20 services', '500 appointments/mo', 'Email notifications', '5 team members'],
                            cta: 'Start Pro Trial',
                            highlight: true,
                        },
                        {
                            name: 'Business',
                            price: '$79',
                            description: 'For large organizations',
                            features: ['Unlimited everything', 'Priority support', 'API access', 'Custom domain'],
                            cta: 'Contact Sales',
                            highlight: false,
                        },
                    ].map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-2xl p-8 border ${plan.highlight
                                    ? 'border-blue-200 bg-gradient-to-b from-blue-50 to-white shadow-lg ring-1 ring-blue-100 relative'
                                    : 'border-slate-200/60 bg-white shadow-sm'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                            <div className="mt-4 mb-6">
                                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup"
                                className={`block text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${plan.highlight
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md'
                                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200/60 bg-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">BookIt</span>
                    </div>
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} BookIt. Built with Next.js, Supabase, and Stripe.
                    </p>
                </div>
            </footer>
        </div>
    );
}
