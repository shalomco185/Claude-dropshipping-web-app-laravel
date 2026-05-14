import { Menu, Transition } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { Fragment } from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Header({ title }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const initials = (user?.name ?? 'U N')
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
                <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="w-64 rounded-lg border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-primary-500 focus:bg-white focus:ring-primary-500"
                    />
                </div>

                <button
                    type="button"
                    className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-medium text-white">
                                {initials}
                            </span>
                        )}
                        <span className="hidden text-sm font-medium text-slate-700 md:block">
                            {user?.name}
                        </span>
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-lg bg-white shadow-lg ring-1 ring-slate-900/5 focus:outline-none">
                            <div className="px-4 py-3">
                                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href={route('settings.index')}
                                            className={`block px-4 py-2 text-sm ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                                        >
                                            Account settings
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href={route('settings.billing')}
                                            className={`block px-4 py-2 text-sm ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                                        >
                                            Billing
                                        </Link>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type="button"
                                            onClick={() => router.post(route('logout'))}
                                            className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-slate-50 text-red-700' : 'text-red-600'}`}
                                        >
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
}
