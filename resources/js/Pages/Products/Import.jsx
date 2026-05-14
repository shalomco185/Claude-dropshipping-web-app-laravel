import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { SparklesIcon } from '@heroicons/react/24/outline';

const suppliers = [
    { value: 'aliexpress', label: 'AliExpress' },
    { value: 'cjdropshipping', label: 'CJ Dropshipping' },
    { value: 'zendrop', label: 'Zendrop' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'temu', label: 'Temu' },
];

export default function ProductsImport() {
    const { data, setData, post, processing, errors } = useForm({
        url: '',
        supplier: 'aliexpress',
        ai_enhance: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.import.store'));
    };

    return (
        <AppLayout title="Import product">
            <div className="mx-auto max-w-2xl">
                <h2 className="mb-1 text-2xl font-semibold text-slate-900">Import a product</h2>
                <p className="mb-6 text-sm text-slate-500">
                    Paste a supplier product URL and we'll do the rest.
                </p>

                <form onSubmit={submit} className="card space-y-6 p-6">
                    <div>
                        <label className="form-label">Supplier</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                            {suppliers.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => setData('supplier', s.value)}
                                    className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                                        data.supplier === s.value
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Product URL"
                        type="url"
                        value={data.url}
                        onChange={(e) => setData('url', e.target.value)}
                        error={errors.url}
                        placeholder="https://www.aliexpress.com/item/1005006..."
                        required
                    />

                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <input
                            type="checkbox"
                            checked={data.ai_enhance}
                            onChange={(e) => setData('ai_enhance', e.target.checked)}
                            className="mt-0.5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="h-4 w-4 text-primary-500" />
                                <p className="text-sm font-medium text-slate-900">
                                    AI enhance description
                                </p>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Auto-rewrite the supplier description into a high-converting one.
                            </p>
                        </div>
                    </label>

                    <Button type="submit" loading={processing} className="w-full">
                        Import product
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
