import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

const types = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'push', label: 'Push' },
];

export default function CampaignCreate({ campaign }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: campaign?.name ?? '',
        type: campaign?.type ?? 'email',
        subject: campaign?.subject ?? '',
        content: campaign?.content ?? '',
        scheduled_at: campaign?.scheduled_at ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (campaign) {
            put(route('marketing.campaigns.update', campaign.id));
        } else {
            post(route('marketing.campaigns.store'));
        }
    };

    return (
        <AppLayout title={campaign ? 'Edit campaign' : 'New campaign'}>
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                    {campaign ? 'Edit campaign' : 'New campaign'}
                </h2>

                <form onSubmit={submit} className="card space-y-6 p-6">
                    <Input
                        label="Campaign name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                    />

                    <div>
                        <label className="form-label">Channel</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {types.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setData('type', t.value)}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                                        data.type === t.value
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {data.type === 'email' && (
                        <Input
                            label="Subject line"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            error={errors.subject}
                        />
                    )}

                    <div>
                        <label className="form-label">Message</label>
                        <textarea
                            rows="10"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    <Input
                        label="Schedule (leave blank to save as draft)"
                        type="datetime-local"
                        value={data.scheduled_at}
                        onChange={(e) => setData('scheduled_at', e.target.value)}
                    />

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={processing}>
                            {campaign ? 'Save changes' : 'Create campaign'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
