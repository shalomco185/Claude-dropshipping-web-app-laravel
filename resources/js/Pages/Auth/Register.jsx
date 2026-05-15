import AuthLayout from '@/Layouts/AuthLayout';
import { Link, useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

const plans = [
    { id: 'starter', name: 'Starter', price: 29, features: '1 store, 500 products' },
    { id: 'professional', name: 'Professional', price: 79, features: '5 stores, AI tools' },
    { id: 'agency', name: 'Agency', price: 199, features: '20 stores, white-label' },
];

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        plan: 'professional',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Start your 14-day free trial" subtitle="No credit card required.">
            <form onSubmit={submit} className="space-y-4">
                <Input
                    type="text"
                    label="Full name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    required
                />
                <Input
                    type="email"
                    label="Email address"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    autoComplete="username"
                    required
                />
                <Input
                    type="password"
                    label="Password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    autoComplete="new-password"
                    required
                />
                <Input
                    type="password"
                    label="Confirm password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                    required
                />

                <div>
                    <label className="form-label">Choose a plan</label>
                    <div className="grid grid-cols-1 gap-2">
                        {plans.map((plan) => (
                            <label
                                key={plan.id}
                                className={`flex cursor-pointer items-center justify-between rounded-lg border-2 px-4 py-3 transition ${
                                    data.plan === plan.id
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        value={plan.id}
                                        checked={data.plan === plan.id}
                                        onChange={(e) => setData('plan', e.target.value)}
                                        className="text-primary-500 focus:ring-primary-500"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{plan.name}</p>
                                        <p className="text-xs text-slate-500">{plan.features}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-slate-900">
                                    ${plan.price}/mo
                                </p>
                            </label>
                        ))}
                    </div>
                </div>

                <Button type="submit" loading={processing} className="w-full">
                    Create account
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link href={route('login')} className="font-medium text-primary-600 hover:text-primary-700">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
