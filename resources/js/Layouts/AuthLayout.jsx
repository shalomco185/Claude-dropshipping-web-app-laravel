import { Head, Link } from '@inertiajs/react';

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Head title={title} />

            <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 p-12 text-white lg:flex">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 font-bold">
                        D
                    </div>
                    <span className="text-xl font-semibold">Dropship SaaS</span>
                </Link>
                <div>
                    <h2 className="text-3xl font-semibold leading-tight">
                        Build a profitable dropshipping business with AI on your side.
                    </h2>
                    <p className="mt-4 text-white/80">
                        From AI product descriptions to automated fulfillment, the all-in-one
                        platform that helps you launch, scale and automate stores.
                    </p>
                </div>
                <div className="text-sm text-white/70">
                    Trusted by 12,000+ entrepreneurs across 60 countries.
                </div>
            </div>

            <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center lg:hidden">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 font-bold text-white">
                                D
                            </div>
                            <span className="text-lg font-semibold">Dropship SaaS</span>
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
                    </div>

                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
