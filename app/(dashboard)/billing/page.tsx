import { Check, CreditCard } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for getting started',
        features: ['Basic booking page', '3 services', '50 appointments/mo'],
        current: true,
    },
    {
        name: 'Pro',
        price: '$29',
        description: 'For growing businesses',
        features: ['Custom branding', '20 services', '500 appointments/mo', 'Email notifications', '5 team members'],
        current: false,
        popular: true,
    },
    {
        name: 'Business',
        price: '$79',
        description: 'For large organizations',
        features: ['Unlimited everything', 'Priority support', 'API access', 'Custom domain'],
        current: false,
    },
];

export default function BillingPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
                <p className="text-slate-500 mt-1">Manage your subscription and billing</p>
            </div>

            {/* Current Plan */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
                </div>
                <p className="text-slate-600">
                    You are currently on the <strong>Free</strong> plan.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`rounded-2xl p-6 border ${plan.popular
                                ? 'border-blue-200 bg-gradient-to-b from-blue-50 to-white shadow-lg ring-1 ring-blue-100 relative'
                                : 'border-slate-200/60 bg-white shadow-sm'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                Most Popular
                            </div>
                        )}
                        <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                        <div className="mt-4 mb-6">
                            <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <ul className="space-y-2.5 mb-6">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${plan.current
                                    ? 'border border-slate-200 text-slate-400 cursor-not-allowed'
                                    : plan.popular
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md'
                                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            disabled={plan.current}
                        >
                            {plan.current ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
