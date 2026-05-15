import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    HomeIcon,
    BuildingStorefrontIcon,
    CubeIcon,
    ShoppingBagIcon,
    UsersIcon,
    MegaphoneIcon,
    ChartBarIcon,
    SparklesIcon,
    Cog6ToothIcon,
    CreditCardIcon,
    ArrowDownTrayIcon,
    TagIcon,
    UserGroupIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
    { name: 'Stores', href: 'stores.index', icon: BuildingStorefrontIcon },
    {
        name: 'Catalog',
        icon: CubeIcon,
        children: [
            { name: 'Products', href: 'products.index' },
            { name: 'Import', href: 'products.import' },
            { name: 'Categories', href: 'categories.index' },
        ],
    },
    { name: 'Orders', href: 'orders.index', icon: ShoppingBagIcon },
    { name: 'Customers', href: 'customers.index', icon: UsersIcon },
    {
        name: 'Marketing',
        icon: MegaphoneIcon,
        children: [
            { name: 'Overview', href: 'marketing.index' },
            { name: 'Campaigns', href: 'marketing.campaigns.index' },
            { name: 'Coupons', href: 'marketing.coupons.index' },
        ],
    },
    { name: 'Analytics', href: 'analytics.index', icon: ChartBarIcon },
    { name: 'AI Tools', href: 'ai.index', icon: SparklesIcon },
    {
        name: 'Settings',
        icon: Cog6ToothIcon,
        children: [
            { name: 'Account', href: 'settings.index' },
            { name: 'Billing', href: 'settings.billing' },
            { name: 'Team', href: 'settings.team' },
        ],
    },
];

function StoreSwitcher() {
    const { stores = [], currentStore } = usePage().props;

    if (!stores || stores.length === 0) {
        return (
            <Link
                href={route('stores.create')}
                className="block rounded-lg bg-slate-700/40 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700/60"
            >
                + Create your first store
            </Link>
        );
    }

    return (
        <div className="rounded-lg bg-slate-700/40 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Active store
            </p>
            <p className="mt-0.5 text-sm font-medium text-white truncate">
                {currentStore?.name ?? stores[0]?.name ?? 'Select a store'}
            </p>
        </div>
    );
}

function NavItem({ item, isCurrent, currentRoute }) {
    const [open, setOpen] = useState(true);

    if (item.children) {
        const childActive = item.children.some(
            (c) => currentRoute && currentRoute.startsWith(c.href.split('.')[0]),
        );

        return (
            <div>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                        childActive
                            ? 'bg-slate-700/60 text-white'
                            : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                    }`}
                >
                    <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                    </span>
                    {open ? (
                        <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                    )}
                </button>
                {open && (
                    <div className="ml-9 mt-1 space-y-1">
                        {item.children.map((child) => (
                            <Link
                                key={child.href}
                                href={route(child.href)}
                                className={`block rounded-md px-2.5 py-1.5 text-sm transition ${
                                    currentRoute === child.href
                                        ? 'bg-primary-500 text-white'
                                        : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'
                                }`}
                            >
                                {child.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={route(item.href)}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isCurrent
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
            }`}
        >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.name}
        </Link>
    );
}

export default function Sidebar() {
    const { component, url } = usePage();
    const currentRoute = (route().current && route().current()) || '';

    return (
        <aside className="hidden lg:flex h-screen w-64 shrink-0 flex-col bg-sidebar text-white">
            <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-700/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 font-bold">
                    D
                </div>
                <span className="text-lg font-semibold">Dropship</span>
            </div>

            <div className="px-4 py-4">
                <StoreSwitcher />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
                {navigation.map((item) => (
                    <NavItem
                        key={item.name}
                        item={item}
                        currentRoute={currentRoute}
                        isCurrent={item.href && currentRoute === item.href}
                    />
                ))}
            </nav>

            <div className="border-t border-slate-700/50 p-3">
                <Link
                    href={route('settings.billing')}
                    className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500 px-3 py-2.5 text-xs font-medium text-white"
                >
                    <CreditCardIcon className="h-4 w-4" />
                    Upgrade your plan
                </Link>
            </div>
        </aside>
    );
}
