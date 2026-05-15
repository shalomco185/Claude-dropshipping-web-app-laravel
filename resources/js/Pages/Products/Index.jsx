import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import { PlusIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const statuses = [
    { value: '', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
];

export default function ProductsIndex({ products, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');

    const applyFilters = (overrides = {}) => {
        router.get(
            route('products.index'),
            {
                search: overrides.search ?? search,
                status: overrides.status ?? status,
            },
            { preserveState: true, replace: true },
        );
    };

    const onSubmit = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <AppLayout title="Products">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
                    <p className="text-sm text-slate-500">Browse and manage your product catalog.</p>
                </div>
                <div className="flex gap-2">
                    <Link href={route('products.import')}>
                        <Button variant="secondary">
                            <ArrowDownTrayIcon className="h-4 w-4" /> Import
                        </Button>
                    </Link>
                    <Link href={route('products.create')}>
                        <Button>
                            <PlusIcon className="h-4 w-4" /> New product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="card p-4">
                <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="form-input pl-9"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            applyFilters({ status: e.target.value });
                        }}
                        className="form-input sm:w-44"
                    >
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" variant="secondary">Apply</Button>
                </form>
            </div>

            <div className="card mt-4 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Product</th>
                                <th className="table-header">Status</th>
                                <th className="table-header text-right">Price</th>
                                <th className="table-header text-right">Stock</th>
                                <th className="table-header"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {(!products?.data || products.data.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-sm text-slate-500">
                                        No products yet. Import your first product or create one.
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        (Array.isArray(product.images) && product.images[0]) ||
                                                        'https://via.placeholder.com/48?text=P'
                                                    }
                                                    alt={product.title}
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {product.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500">SKU-{product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                color={
                                                    product.status === 'active'
                                                        ? 'green'
                                                        : product.status === 'draft'
                                                            ? 'gray'
                                                            : 'yellow'
                                                }
                                            >
                                                {product.status}
                                            </Badge>
                                        </td>
                                        <td className="table-cell text-right">
                                            ${Number(product.price).toFixed(2)}
                                        </td>
                                        <td className="table-cell text-right">{product.stock}</td>
                                        <td className="table-cell text-right">
                                            <Link
                                                href={route('products.edit', product.id)}
                                                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {products?.links && <Pagination links={products.links} />}
            </div>
        </AppLayout>
    );
}
