import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function SettingsIndex() {
    const { auth } = usePage().props;

    return (
        <AppLayout title="Account settings">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-6 text-2xl font-semibold text-slate-900">Account settings</h2>

                <div className="card space-y-5 p-6">
                    <h3 className="text-base font-semibold text-slate-900">Profile</h3>
                    <Input label="Name" defaultValue={auth?.user?.name} />
                    <Input label="Email" type="email" defaultValue={auth?.user?.email} />
                    <div className="flex justify-end">
                        <Button>Save changes</Button>
                    </div>
                </div>

                <div className="card mt-6 space-y-5 p-6">
                    <h3 className="text-base font-semibold text-slate-900">Security</h3>
                    <Input label="Current password" type="password" />
                    <Input label="New password" type="password" />
                    <Input label="Confirm new password" type="password" />
                    <div className="flex justify-end">
                        <Button>Update password</Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
