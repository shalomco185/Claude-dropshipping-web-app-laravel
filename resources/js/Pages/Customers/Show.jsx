import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import OrderStatusBadge from '@/Components/OrderStatusBadge';
import Button from '@/Components/Button';

export default function CustomerShow({ customer }) {
    return (
        <AppLayout title={customer.name}>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-base font-semibold text-primary-700">
                        {customer.name?.[0]?.toUpperCase()}
                    </span>
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">{customer.name}</h2>
                        <p className="text-sm text-slate-500">{customer.email}</p>
                    </div>
                </div>
                <Link href={route('customers.index')}>
                    <Button variant="secondary">Back</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="card p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total orders</p>
                    <p className="mt-2 text-2xl font-semibold">{customer.total_orders}</p>
                </div>
                <div className="card p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total spent</p>
                    <p className="mt-2 text-2xl font-semibold">
                        ${Number(customer.total_spent).toFixed(2)}
                    </p>
                </div>
                <div className="card p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Last order</p>
                    <p className="mt-2 text-base font-medium">
                        {customer.last_order_at
                            ? new Date(customer.last_order_at).toLocaleDateString()
                            : 'Never'}
                    </p>
                </div>
            </div>

            <div className="card mt-6 p-5">
                <h3 className="mb-4 text-base font-semibold text-slate-900">Order history</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-2 py-2">Order</th>
                                <th className="px-2 py-2">Status</th>
                                <th className="px-2 py-2 text-right">Total</th>
                                <th className="px-2 py-2 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(customer.orders ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-sm text-slate-500">
                                        No orders yet.
                                    </td>
                                </tr>
                            ) : (
                                customer.orders.map((order) => (
                                    <tr key={order.id} className="text-sm">
                                        <td className="px-2 py-3">
                                            <Link
                                                href={route('orders.show', order.id)}
                                                className="font-medium text-primary-600 hover:text-primary-700"
                                            >
                                                #{order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-2 py-3">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-2 py-3 text-right font-medium">
                                            ${Number(order.total).toFixed(2)}
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
