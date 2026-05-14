import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import { PlusIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function StoresIndex({ stores = [] }) {
    return (
        <AppLayout title="Stores">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Stores</h2>
                    <p className="text-sm text-slate-500">Manage all the storefronts under your account.</p>
                </div>
                <Link href={route('stores.create')}>
                    <Button>
                        <PlusIcon className="h-4 w-4" /> New store
                    </Button>
                </Link>
            </div>

            {stores.length === 0 ? (
                <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
                    <BuildingStorefrontIcon className="h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">No stores yet</h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Create your first store to start importing products and selling.
                    </p>
                    <Link href={route('stores.create')} className="mt-6">
                        <Button>
                            <PlusIcon className="h-4 w-4" /> Create store
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stores.map((store) => (
                        <Link
                            href={route('stores.show', store.id)}
                            key={store.id}
                            className="card group p-5 transition hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 font-semibold text-primary-600">
                                    {store.name.charAt(0).toUpperCase()}
                                </div>
                                <Badge color={store.is_active ? 'green' : 'gray'}>
                                    {store.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-primary-600">
                                {store.name}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">{store.domain}</p>
                            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                                <span>{store.currency}</span>
                                <span>·</span>
                                <span>{store.language?.toUpperCase()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
