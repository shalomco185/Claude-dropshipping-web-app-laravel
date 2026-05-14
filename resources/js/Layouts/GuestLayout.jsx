import { Head, Link } from '@inertiajs/react';

export default function GuestLayout({ title, children }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Head title={title} />
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 font-bold text-white">
                            D
                        </div>
                        <span className="text-lg font-semibold">Dropship SaaS</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href={route('login')} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                        >
                            Get started
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-6 py-12">{children}</main>
        </div>
    );
}
