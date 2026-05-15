import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:rounded-b-xl">
            <div className="hidden flex-1 items-center justify-between sm:flex">
                <p className="text-sm text-slate-500">Showing results</p>
                <div className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            preserveScroll
                            className={`relative inline-flex items-center px-3 py-1.5 text-sm border ${
                                link.active
                                    ? 'z-10 bg-primary-500 border-primary-500 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </nav>
    );
}
