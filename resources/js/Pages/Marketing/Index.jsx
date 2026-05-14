import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import { PlusIcon, MegaphoneIcon, TagIcon } from '@heroicons/react/24/outline';

export default function MarketingOverview({ campaigns = [], coupons = [] }) {
    return (
        <AppLayout title="Marketing">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Marketing</h2>
                <p className="text-sm text-slate-500">
                    Run email, SMS and discount campaigns from one place.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MegaphoneIcon className="h-5 w-5 text-primary-500" />
                            <h3 className="text-base font-semibold text-slate-900">Recent campaigns</h3>
                        </div>
                        <Link href={route('marketing.campaigns.create')}>
                            <Button size="sm">
                                <PlusIcon className="h-3.5 w-3.5" /> New campaign
                            </Button>
                        </Link>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {campaigns.length === 0 ? (
                            <li className="py-6 text-center text-sm text-slate-500">
                                No campaigns yet.
                            </li>
                        ) : (
                            campaigns.map((campaign) => (
                                <li key={campaign.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{campaign.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">
                                            {campaign.type} · {campaign.status}
                                        </p>
                                    </div>
                                    <Badge color={campaign.status === 'sent' ? 'green' : 'gray'}>
                                        {campaign.status}
                                    </Badge>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="card p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TagIcon className="h-5 w-5 text-primary-500" />
                            <h3 className="text-base font-semibold text-slate-900">Active coupons</h3>
                        </div>
                        <Link href={route('marketing.coupons.index')}>
                            <Button size="sm" variant="secondary">Manage</Button>
                        </Link>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {coupons.length === 0 ? (
                            <li className="py-6 text-center text-sm text-slate-500">
                                No coupons yet.
                            </li>
                        ) : (
                            coupons.map((coupon) => (
                                <li key={coupon.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-mono text-sm font-semibold text-slate-900">
                                            {coupon.code}
                                        </p>
                                        <p className="text-xs text-slate-500 capitalize">
                                            {coupon.type === 'percentage'
                                                ? `${coupon.value}% off`
                                                : `$${coupon.value} off`}
                                        </p>
                                    </div>
                                    <Badge color={coupon.is_active ? 'green' : 'gray'}>
                                        {coupon.is_active ? 'Active' : 'Disabled'}
                                    </Badge>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
