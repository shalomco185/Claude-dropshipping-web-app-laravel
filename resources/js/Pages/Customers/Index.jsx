import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function CustomersIndex({ customers, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const onSubmit = (e) => {
        e.preventDefault();
        router.get(route('customers.index'), { search }, { preserveState: true });
    };

    return (
        <AppLayout title="Customers">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Customers</h2>
                <p className="text-sm text-slate-500">
                    A list of every customer that has bought from your stores.
                </p>
            </div>

            <div className="card p-4">
                <form onSubmit={onSubmit} className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="form-input pl-9"
                    />
                </form>
            </div>

            <div className="card mt-4 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Customer</th>
                                <th className="table-header">Email</th>
                                <th className="table-header text-right">Orders</th>
                                <th className="table-header text-right">Spent</th>
                                <th className="table-header text-right">Last order</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!customers?.data || customers.data.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-sm text-slate-500">
                                        No customers yet.
                                    </td>
                                </tr>
                            ) : (
                                customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route('customers.show', customer.id)}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-medium text-primary-700">
                                                    {customer.name?.[0]?.toUpperCase()}
                                                </span>
                                                <span className="text-sm font-medium text-slate-900">
                                                    {customer.name}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="table-cell text-slate-600">{customer.email}</td>
                                        <td className="table-cell text-right">
                                            {customer.total_orders}
                                        </td>
                                        <td className="table-cell text-right font-medium">
                                            ${Number(customer.total_spent).toFixed(2)}
                                        </td>
                                        <td className="table-cell text-right text-slate-500">
                                            {customer.last_order_at
                                                ? new Date(customer.last_order_at).toLocaleDateString()
                                                : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {customers?.links && <Pagination links={customers.links} />}
            </div>
        </AppLayout>
    );
}
