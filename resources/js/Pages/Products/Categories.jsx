import AppLayout from '@/Layouts/AppLayout';
import { useForm, router } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function Categories({ categories = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        sort_order: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => reset('name'),
        });
    };

    return (
        <AppLayout title="Categories">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-6 text-2xl font-semibold text-slate-900">Categories</h2>

                <form onSubmit={submit} className="card mb-6 flex items-end gap-3 p-4">
                    <Input
                        label="Add a category"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        className="flex-1"
                        placeholder="e.g. Electronics"
                    />
                    <Button type="submit" loading={processing}>Add</Button>
                </form>

                <div className="card divide-y divide-slate-100">
                    {categories.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-slate-500">
                            No categories yet.
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {category.name}
                                    </p>
                                    <p className="text-xs text-slate-500">/{category.slug}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.delete(route('categories.destroy', category.id))}
                                    className="text-xs font-medium text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
