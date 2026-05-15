import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CampaignsIndex({ campaigns }) {
    return (
        <AppLayout title="Campaigns">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Campaigns</h2>
                    <p className="text-sm text-slate-500">Email, SMS, WhatsApp and push campaigns.</p>
                </div>
                <Link href={route('marketing.campaigns.create')}>
                    <Button>
                        <PlusIcon className="h-4 w-4" /> New campaign
                    </Button>
                </Link>
            </div>

            <div className="card overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="table-header">Name</th>
                            <th className="table-header">Type</th>
                            <th className="table-header">Status</th>
                            <th className="table-header text-right">Open rate</th>
                            <th className="table-header text-right">Click rate</th>
                            <th className="table-header text-right">Sent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(!campaigns?.data || campaigns.data.length === 0) ? (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-sm text-slate-500">
                                    No campaigns yet.
                                </td>
                            </tr>
                        ) : (
                            campaigns.data.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="table-cell font-medium text-slate-900">{c.name}</td>
                                    <td className="table-cell capitalize">{c.type}</td>
                                    <td className="table-cell">
                                        <Badge color={c.status === 'sent' ? 'green' : 'gray'}>
                                            {c.status}
                                        </Badge>
                                    </td>
                                    <td className="table-cell text-right">{c.open_rate ?? 0}%</td>
                                    <td className="table-cell text-right">{c.click_rate ?? 0}%</td>
                                    <td className="table-cell text-right text-slate-500">
                                        {c.sent_at ? new Date(c.sent_at).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {campaigns?.links && <Pagination links={campaigns.links} />}
            </div>
        </AppLayout>
    );
}
