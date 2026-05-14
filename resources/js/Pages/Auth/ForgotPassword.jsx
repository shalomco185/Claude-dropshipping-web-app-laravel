import AuthLayout from '@/Layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="We'll email you a link to reset it."
        >
            {status && (
                <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Input
                    type="email"
                    label="Email address"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    required
                />

                <Button type="submit" loading={processing} className="w-full">
                    Send reset link
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Remember your password?{' '}
                <Link href={route('login')} className="font-medium text-primary-600 hover:text-primary-700">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
