import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Dropship SaaS';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1e293b',
                            color: '#f8fafc',
                        },
                    }}
                />
            </>,
        );
    },
    progress: {
        color: '#6366f1',
        showSpinner: true,
    },
});
