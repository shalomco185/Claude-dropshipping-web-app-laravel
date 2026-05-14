import AppLayout from '@/Layouts/AppLayout';
import StatsCard from '@/Components/StatsCard';
import Chart from '@/Components/Chart';
import OrderStatusBadge from '@/Components/OrderStatusBadge';
import { Link } from '@inertiajs/react';
import {
    BanknotesIcon,
    ShoppingCartIcon,
    CubeIcon,
    ArrowTrendingUpIcon,
    PlusIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

export default function DashboardIndex({ summary, revenueSeries, recentOrders, topProducts }) {
    const chartData = {
        labels: revenueSeries?.map((d) => d.label) ?? [],
        datasets: [
            {
                label: 'Revenue',
                data: revenueSeries?.map((d) => d.revenue) ?? [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                tension: 0.35,
                fill: true,
                borderWidth: 2.5,
                pointRadius: 0,
                pointHoverRadius: 5,
            },
        ],
    };

    const formatCurrency = (n) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(n ?? 0);

    return (
        <AppLayout title="Dashboard">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
                    <p className="text-sm text-slate-500">
                        Here's what's happening across your stores in the last 30 days.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route('products.import')}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                        <PlusIcon className="h-4 w-4" /> Import product
                    </Link>
                    <Link
                        href={route('ai.index')}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
                    >
                        <SparklesIcon className="h-4 w-4" /> AI tools
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Total Revenue"
                    value={formatCurrency(summary?.revenue?.value)}
                    change={summary?.revenue?.change}
                    icon={BanknotesIcon}
                />
                <StatsCard
                    label="Active Orders"
                    value={summary?.orders?.value ?? 0}
                    change={summary?.orders?.change}
                    icon={ShoppingCartIcon}
                />
                <StatsCard
                    label="Total Products"
                    value={summary?.products?.value ?? 0}
                    icon={CubeIcon}
                />
                <StatsCard
                    label="Conversion Rate"
                    value={summary?.conversion?.value ?? 0}
                    suffix="%"
                    icon={ArrowTrendingUpIcon}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="card lg:col-span-2 p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Revenue</h3>
                            <p className="text-xs text-slate-500">Last 30 days</p>
                        </div>
                        <span className="text-xs font-medium text-primary-600">
                            {formatCurrency(summary?.revenue?.value)} earned
                        </span>
                    </div>
                    <Chart type="line" data={chartData} height={280} />
                </div>

                <div className="card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900">Top products</h3>
                        <Link
                            href={route('products.index')}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                            View all
                        </Link>
                    </div>
                    {(!topProducts || topProducts.length === 0) ? (
                        <p className="py-10 text-center text-sm text-slate-500">No products yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {topProducts.map((product) => (
                                <li key={product.id} className="flex items-center gap-3 py-3">
                                    <img
                                        src={
                                            (Array.isArray(product.images) && product.images[0]) ||
                                            'https://via.placeholder.com/48?text=P'
                                        }
                                        alt={product.title}
                                        className="h-10 w-10 rounded-lg object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-900">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {product.stock} units in stock
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        ${Number(product.price).toFixed(2)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="card mt-6 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Recent orders</h3>
                    <Link
                        href={route('orders.index')}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                        View all orders
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-2 py-2">Order</th>
                                <th className="px-2 py-2">Customer</th>
                                <th className="px-2 py-2">Status</th>
                                <th className="px-2 py-2 text-right">Total</th>
                                <th className="px-2 py-2 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(!recentOrders || recentOrders.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-sm text-slate-500">
                                        No orders yet. They'll appear here when customers buy.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="text-sm">
                                        <td className="px-2 py-3 font-medium text-slate-900">
                                            <Link
                                                href={route('orders.show', order.id)}
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                #{order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3 text-slate-700">
                                            {order.customer?.name ?? 'Guest customer'}
                                        </td>
                                        <td className="px-2 py-3">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-2 py-3 text-right font-medium text-slate-900">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-2 py-3 text-right text-slate-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
