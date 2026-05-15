import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';

export default function StatsCard({ label, value, change, icon: Icon, prefix = '', suffix = '' }) {
    const isPositive = change >= 0;
    const showChange = typeof change === 'number' && change !== 0;

    return (
        <div className="card p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {prefix}
                        {value}
                        {suffix}
                    </p>
                </div>
                {Icon && (
                    <div className="rounded-lg bg-primary-50 p-2.5">
                        <Icon className="h-5 w-5 text-primary-500" />
                    </div>
                )}
            </div>
            {showChange && (
                <div className="mt-3 flex items-center gap-1 text-xs">
                    {isPositive ? (
                        <ArrowUpIcon className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                        <ArrowDownIcon className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span
                        className={`font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                        {Math.abs(change)}%
                    </span>
                    <span className="text-slate-500">vs last period</span>
                </div>
            )}
        </div>
    );
}
