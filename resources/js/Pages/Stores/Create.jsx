import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'BRL', 'INR', 'JPY'];
const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'pt', label: 'Portuguese' },
];

export default function StoresCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        domain: '',
        currency: 'USD',
        language: 'en',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stores.store'));
    };

    return (
        <AppLayout title="Create store">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Create a new store</h2>
                    <p className="text-sm text-slate-500">Set up the basics. You can change everything later.</p>
                </div>

                <form onSubmit={submit} className="card space-y-6 p-6">
                    <Input
                        label="Store name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        placeholder="Trendy Trinkets"
                        required
                    />
                    <Input
                        label="Store domain (sub-domain)"
                        value={data.domain}
                        onChange={(e) => setData('domain', e.target.value)}
                        error={errors.domain}
                        placeholder="trendy-trinkets"
                        hint="We'll auto-generate one if you leave this blank."
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="form-label">Currency</label>
                            <select
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                                className="form-input"
                            >
                                {currencies.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Language</label>
                            <select
                                value={data.language}
                                onChange={(e) => setData('language', e.target.value)}
                                className="form-input"
                            >
                                {languages.map((l) => (
                                    <option key={l.code} value={l.code}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={processing}>
                            Create store
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
