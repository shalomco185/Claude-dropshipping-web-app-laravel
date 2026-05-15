import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';

export default function StoresShow({ store }) {
    const { data, setData, put, processing, errors } = useForm({
        name: store.name,
        currency: store.currency,
        language: store.language,
        custom_domain: store.custom_domain ?? '',
        theme: store.theme ?? 'default',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('stores.update', store.id));
    };

    return (
        <AppLayout title={store.name}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{store.name}</h2>
                    <p className="text-sm text-slate-500">{store.domain}.dropship.app</p>
                </div>
                <div className="flex gap-2">
                    <Link href={route('stores.index')}>
                        <Button variant="secondary">Back</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="card p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Products</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{store.products_count ?? 0}</p>
                </div>
                <div className="card p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Orders</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{store.orders_count ?? 0}</p>
                </div>
                <div className="card p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Customers</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{store.customers_count ?? 0}</p>
                </div>
            </div>

            <form onSubmit={submit} className="card mt-6 space-y-6 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Store settings</h3>
                <Input
                    label="Store name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                />
                <Input
                    label="Custom domain"
                    value={data.custom_domain}
                    onChange={(e) => setData('custom_domain', e.target.value)}
                    error={errors.custom_domain}
                    placeholder="shop.yourdomain.com"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label className="form-label">Currency</label>
                        <input
                            type="text"
                            maxLength={3}
                            value={data.currency}
                            onChange={(e) => setData('currency', e.target.value.toUpperCase())}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="form-label">Language</label>
                        <input
                            type="text"
                            maxLength={5}
                            value={data.language}
                            onChange={(e) => setData('language', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="form-label">Theme</label>
                        <input
                            type="text"
                            value={data.theme}
                            onChange={(e) => setData('theme', e.target.value)}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" loading={processing}>Save changes</Button>
                </div>
            </form>
        </AppLayout>
    );
}
