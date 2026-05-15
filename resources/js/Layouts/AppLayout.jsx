import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import Notification from '@/Components/Notification';

export default function AppLayout({ title = 'Dashboard', children }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Head title={title} />
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Header title={title} />
                <main className="flex-1 p-6">{children}</main>
            </div>
            <Notification />
        </div>
    );
}
