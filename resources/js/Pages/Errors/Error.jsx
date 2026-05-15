import { Head, Link } from '@inertiajs/react';

const messages = {
    503: 'Service unavailable',
    500: 'Server error',
    404: 'Page not found',
    403: 'Forbidden',
};

export default function ErrorPage({ status }) {
    const message = messages[status] ?? 'Unexpected error';

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <Head title={message} />
            <div className="text-center">
                <p className="text-base font-semibold text-primary-600">{status}</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{message}</h1>
                <p className="mt-3 text-sm text-slate-500">
                    Sorry, we couldn't process your request.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center rounded-lg bg-primary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
