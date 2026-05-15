import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({
    show = false,
    onClose,
    title,
    children,
    maxWidth = '2xl',
    showClose = true,
}) {
    const widthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} appear>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`w-full ${widthClass} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
                            >
                                {title && (
                                    <div className="mb-4 flex items-center justify-between">
                                        <Dialog.Title className="text-lg font-semibold text-slate-900">
                                            {title}
                                        </Dialog.Title>
                                        {showClose && (
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
