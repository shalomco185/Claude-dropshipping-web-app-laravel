import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function ProductsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        compare_price: '',
        cost: '',
        stock: 0,
        status: 'draft',
        category: '',
        tags: [],
        images: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AppLayout title="New product">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-1 text-2xl font-semibold text-slate-900">Create a product</h2>
                <p className="mb-6 text-sm text-slate-500">
                    Add a product manually. You can also import from a supplier.
                </p>

                <form onSubmit={submit} className="space-y-6">
                    <div className="card space-y-5 p-6">
                        <Input
                            label="Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            error={errors.title}
                            required
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                rows="6"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="form-input"
                            />
                            {errors.description && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="card space-y-5 p-6">
                        <h3 className="text-base font-semibold text-slate-900">Pricing</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Input
                                label="Price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                error={errors.price}
                                required
                            />
                            <Input
                                label="Compare at"
                                type="number"
                                step="0.01"
                                value={data.compare_price}
                                onChange={(e) => setData('compare_price', e.target.value)}
                                error={errors.compare_price}
                            />
                            <Input
                                label="Cost"
                                type="number"
                                step="0.01"
                                value={data.cost}
                                onChange={(e) => setData('cost', e.target.value)}
                                error={errors.cost}
                            />
                        </div>
                    </div>

                    <div className="card space-y-5 p-6">
                        <h3 className="text-base font-semibold text-slate-900">Inventory & status</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Stock"
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                error={errors.stock}
                            />
                            <div>
                                <label className="form-label">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={processing}>
                            Create product
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
