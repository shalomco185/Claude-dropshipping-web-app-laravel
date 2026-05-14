import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function ProductsEdit({ product }) {
    const { data, setData, put, processing, errors } = useForm({
        title: product.title ?? '',
        description: product.description ?? '',
        price: product.price ?? '',
        compare_price: product.compare_price ?? '',
        cost: product.cost ?? '',
        stock: product.stock ?? 0,
        status: product.status ?? 'draft',
        category: product.category ?? '',
        tags: product.tags ?? [],
        images: product.images ?? [],
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AppLayout title={`Edit ${product.title}`}>
            <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">{product.title}</h2>
                        <p className="text-sm text-slate-500">Edit product details</p>
                    </div>
                    <Link href={route('products.index')}>
                        <Button variant="secondary">Back</Button>
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="card space-y-5 p-6">
                        <Input
                            label="Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            error={errors.title}
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                rows="8"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="form-input"
                            />
                        </div>
                        {product.ai_description && (
                            <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                                    AI-enhanced description
                                </p>
                                <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                                    {product.ai_description}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="card space-y-5 p-6">
                        <h3 className="text-base font-semibold text-slate-900">Pricing & stock</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <Input
                                label="Price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            <Input
                                label="Compare at"
                                type="number"
                                step="0.01"
                                value={data.compare_price ?? ''}
                                onChange={(e) => setData('compare_price', e.target.value)}
                            />
                            <Input
                                label="Cost"
                                type="number"
                                step="0.01"
                                value={data.cost ?? ''}
                                onChange={(e) => setData('cost', e.target.value)}
                            />
                            <Input
                                label="Stock"
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="form-input sm:w-1/3"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" loading={processing}>Save changes</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
