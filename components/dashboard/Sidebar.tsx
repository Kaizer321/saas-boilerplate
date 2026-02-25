'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Calendar,
    Briefcase,
    Clock,
    Users,
    Settings,
    CreditCard,
    Calendar as CalendarIcon,
    X,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Availability', href: '/availability', icon: Clock },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/60 transition-transform duration-300 ease-in-out',
                'lg:translate-x-0 lg:z-auto',
                open ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/60">
                <Link href="/" className="flex items-center gap-2">
                    <CalendarIcon className="h-7 w-7 text-blue-600" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        BookIt
                    </span>
                </Link>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            )}
                        >
                            <item.icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-slate-400')} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-4 border-t border-slate-200/60">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Free Plan</p>
                    <p className="text-xs text-slate-600 mb-3">Upgrade to unlock more features</p>
                    <Link
                        href="/billing"
                        onClick={onClose}
                        className="block text-center text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                        Upgrade
                    </Link>
                </div>
            </div>
        </aside>
    );
}
