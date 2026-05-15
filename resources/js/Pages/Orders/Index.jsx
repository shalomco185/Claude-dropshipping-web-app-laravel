import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/Components/Button';
import OrderStatusBadge from '@/Components/OrderStatusBadge';
import Pagination from '@/Components/Pagination';
import { ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const statusFilters = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersIndex({ orders, filters, statusCounts = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [activeStatus, setActiveStatus] = useState(filters?.status ?? '');

    const applyFilter = (status) => {
        setActiveStatus(status);
        router.get(
            route('orders.index'),
            { status, search },
            { preserveState: true, replace: true },
        );
    };

    const onSubmit = (e) => {
        e.preventDefault();
        router.get(route('orders.index'), { search, status: activeStatus }, { preserveState: true });
    };

    return (
        <AppLayout title="Orders">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Orders</h2>
                    <p className="text-sm text-slate-500">View, manage and fulfill all your orders.</p>
                </div>
                <a href={route('orders.export')}>
                    <Button variant="secondary">
                        <ArrowDownTrayIcon className="h-4 w-4" /> Export CSV
                    </Button>
                </a>
            </div>

            <div className="card mb-4 flex items-center gap-2 overflow-x-auto p-2">
                {statusFilters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => applyFilter(filter.value)}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            activeStatus === filter.value
                                ? 'bg-primary-500 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {filter.label}
                        {filter.value && statusCounts[filter.value] && (
                            <span className="rounded-full bg-white/20 px-1.5 text-xs">
                                {statusCounts[filter.value]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="card p-4">
                <form onSubmit={onSubmit} className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by order number..."
                        className="form-input pl-9"
                    />
                </form>
            </div>

            <div className="card mt-4 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Order</th>
                                <th className="table-header">Customer</th>
                                <th className="table-header">Status</th>
                                <th className="table-header">Payment</th>
                                <th className="table-header text-right">Total</th>
                                <th className="table-header text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!orders?.data || orders.data.length === 0) ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-sm text-slate-500">
                                        No orders match the current filters.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50">
                                        <td className="table-cell font-medium">
                                            <Link
                                                href={route('orders.show', order.id)}
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                #{order.order_number}
                                            </Link>
                                        </td>
                                        <td className="table-cell">
                                            {order.customer?.name ?? 'Guest'}
                                            <p className="text-xs text-slate-500">
                                                {order.customer?.email}
                                            </p>
                                        </td>
                                        <td className="table-cell">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="table-cell capitalize text-slate-600">
                                            {order.payment_status}
                                        </td>
                                        <td className="table-cell text-right font-medium">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="table-cell text-right text-slate-500">
                                            {new Date(order.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {orders?.links && <Pagination links={orders.links} />}
            </div>
        </AppLayout>
    );
}
