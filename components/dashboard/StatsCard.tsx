import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: StatsCardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow',
                className
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-600" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                    {description && (
                        <p className="text-sm text-slate-500 mt-1">{description}</p>
                    )}
                </div>
                {trend && (
                    <span
                        className={cn(
                            'text-sm font-medium px-2 py-0.5 rounded-full',
                            trend.isPositive
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                        )}
                    >
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>
        </div>
    );
}
