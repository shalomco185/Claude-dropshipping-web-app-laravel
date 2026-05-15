import AppLayout from '@/Layouts/AppLayout';
import { router, usePage } from '@inertiajs/react';
import { CheckIcon } from '@heroicons/react/24/solid';
import Button from '@/Components/Button';

export default function BillingPage({ subscription, plans }) {
    const { auth } = usePage().props;

    const choose = (planId) => {
        router.post(route('settings.billing.subscribe'), { plan: planId });
    };

    const cancel = () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
            router.post(route('settings.billing.cancel'));
        }
    };

    return (
        <AppLayout title="Billing">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Billing & plans</h2>
                <p className="text-sm text-slate-500">
                    Choose the plan that best fits your business.
                </p>
            </div>

            {subscription && (
                <div className="card mb-6 flex items-center justify-between p-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Current plan
                        </p>
                        <p className="mt-1 text-xl font-semibold capitalize text-slate-900">
                            {subscription.plan}
                        </p>
                        <p className="text-sm text-slate-500">
                            Status:{' '}
                            <span className="capitalize">{subscription.status}</span>
                            {subscription.current_period_end && (
                                <> · renews {new Date(subscription.current_period_end).toLocaleDateString()}</>
                            )}
                        </p>
                    </div>
                    <Button variant="danger" onClick={cancel}>Cancel</Button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`card relative p-6 ${
                            plan.highlighted
                                ? 'ring-2 ring-primary-500 shadow-lg'
                                : ''
                        }`}
                    >
                        {plan.highlighted && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                                Most popular
                            </span>
                        )}
                        <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                        <p className="mt-1 text-sm text-slate-500 min-h-[40px]">
                            {plan.description}
                        </p>
                        <p className="mt-4 text-3xl font-bold text-slate-900">
                            {plan.price !== null ? (
                                <>
                                    ${plan.price}
                                    <span className="text-sm font-medium text-slate-500">/mo</span>
                                </>
                            ) : (
                                'Custom'
                            )}
                        </p>
                        <ul className="mt-4 space-y-2">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <Button
                                variant={plan.highlighted ? 'primary' : 'secondary'}
                                className="w-full"
                                onClick={() => choose(plan.id)}
                                disabled={subscription?.plan === plan.id}
                            >
                                {subscription?.plan === plan.id
                                    ? 'Current plan'
                                    : auth?.user?.plan === plan.id
                                        ? 'Active'
                                        : `Choose ${plan.name}`}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
