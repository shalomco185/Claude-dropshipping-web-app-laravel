import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import StatsCard from '@/Components/StatsCard';
import Chart from '@/Components/Chart';
import {
    BanknotesIcon,
    ShoppingCartIcon,
    UsersIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const ranges = [
    { value: 7, label: '7d' },
    { value: 30, label: '30d' },
    { value: 90, label: '90d' },
    { value: 365, label: '1y' },
];

export default function AnalyticsIndex({ summary, revenueSeries, topProducts, days }) {
    const chartData = {
        labels: revenueSeries?.map((d) => d.label) ?? [],
        datasets: [
            {
                label: 'Revenue',
                data: revenueSeries?.map((d) => d.revenue) ?? [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.35,
                fill: true,
                borderWidth: 2,
            },
        ],
    };

    return (
        <AppLayout title="Analytics">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Analytics</h2>
                    <p className="text-sm text-slate-500">
                        Real-time insights for the last {days} days.
                    </p>
                </div>
                <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                    {ranges.map((r) => (
                        <button
                            key={r.value}
                            type="button"
                            onClick={() =>
                                router.get(route('analytics.index'), { days: r.value }, { preserveState: true })
                            }
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                days === r.value
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Revenue"
                    value={`$${Number(summary?.revenue?.value ?? 0).toLocaleString()}`}
                    change={summary?.revenue?.change}
                    icon={BanknotesIcon}
                />
                <StatsCard
                    label="Orders"
                    value={summary?.orders?.value ?? 0}
                    change={summary?.orders?.change}
                    icon={ShoppingCartIcon}
                />
                <StatsCard
                    label="Customers"
                    value={summary?.customers ?? 0}
                    icon={UsersIcon}
                />
                <StatsCard
                    label="Conversion"
                    value={summary?.conversion?.value ?? 0}
                    suffix="%"
                    icon={ArrowTrendingUpIcon}
                />
            </div>

            <div className="card mt-6 p-5">
                <h3 className="mb-4 text-base font-semibold text-slate-900">Revenue trend</h3>
                <Chart type="line" data={chartData} height={320} />
            </div>

            <div className="card mt-6 p-5">
                <h3 className="mb-4 text-base font-semibold text-slate-900">Top products</h3>
                <ul className="divide-y divide-slate-100">
                    {(topProducts ?? []).length === 0 ? (
                        <li className="py-6 text-center text-sm text-slate-500">No data yet.</li>
                    ) : (
                        topProducts.map((p, idx) => (
                            <li key={p.id} className="flex items-center gap-3 py-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">
                                    {idx + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{p.title}</p>
                                    <p className="text-xs text-slate-500">{p.stock} units in stock</p>
                                </div>
                                <p className="text-sm font-semibold">${Number(p.price).toFixed(2)}</p>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </AppLayout>
    );
}
