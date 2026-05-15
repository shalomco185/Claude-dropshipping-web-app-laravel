import GuestLayout from '@/Layouts/GuestLayout';
import { Link } from '@inertiajs/react';
import {
    SparklesIcon,
    ChartBarIcon,
    BuildingStorefrontIcon,
    ShoppingBagIcon,
} from '@heroicons/react/24/outline';

const features = [
    {
        icon: BuildingStorefrontIcon,
        title: 'Multi-store management',
        description: 'Run unlimited stores from a single dashboard with custom domains.',
    },
    {
        icon: ShoppingBagIcon,
        title: 'One-click product import',
        description: 'Import from AliExpress, CJ, Zendrop, Amazon and Temu in seconds.',
    },
    {
        icon: SparklesIcon,
        title: 'AI everywhere',
        description: 'Auto-generate descriptions, ad copy, SEO meta and more with GPT.',
    },
    {
        icon: ChartBarIcon,
        title: 'Profit analytics',
        description: 'Real-time KPIs, cohort revenue, and supplier-level margin tracking.',
    },
];

export default function Welcome({ canLogin, canRegister }) {
    return (
        <GuestLayout title="Dropship SaaS">
            <section className="text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    AI-powered dropshipping platform
                </span>
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Launch a dropshipping empire
                    <span className="block text-primary-600">in minutes, not months.</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                    Find winning products, build branded stores, automate fulfillment and run
                    AI-generated marketing campaigns - all from one beautifully simple dashboard.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                    {canRegister && (
                        <Link
                            href={route('register')}
                            className="rounded-lg bg-primary-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-600"
                        >
                            Start 14-day free trial
                        </Link>
                    )}
                    {canLogin && (
                        <Link
                            href={route('login')}
                            className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </section>

            <section className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="card p-6 text-left transition hover:shadow-lg"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                            <feature.icon className="h-5 w-5 text-primary-500" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            {feature.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                    </div>
                ))}
            </section>
        </GuestLayout>
    );
}
