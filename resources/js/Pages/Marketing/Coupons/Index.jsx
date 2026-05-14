import AppLayout from '@/Layouts/AppLayout';
import { useForm, router } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';

export default function CouponsIndex({ coupons }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        type: 'percentage',
        value: 10,
        min_order: '',
        max_uses: '',
        expires_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('marketing.coupons.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout title="Coupons">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Coupons</h2>
                <p className="text-sm text-slate-500">Create discount codes for your customers.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <form onSubmit={submit} className="card space-y-4 p-5">
                    <h3 className="text-base font-semibold text-slate-900">Create a coupon</h3>
                    <Input
                        label="Code"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        error={errors.code}
                        placeholder="SUMMER20"
                        required
                    />
                    <div>
                        <label className="form-label">Type</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="form-input"
                        >
                            <option value="percentage">Percentage off</option>
                            <option value="fixed">Fixed amount</option>
                            <option value="free_shipping">Free shipping</option>
                        </select>
                    </div>
                    <Input
                        label="Value"
                        type="number"
                        step="0.01"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                    />
                    <Input
                        label="Minimum order"
                        type="number"
                        step="0.01"
                        value={data.min_order}
                        onChange={(e) => setData('min_order', e.target.value)}
                    />
                    <Input
                        label="Max uses"
                        type="number"
                        value={data.max_uses}
                        onChange={(e) => setData('max_uses', e.target.value)}
                    />
                    <Input
                        label="Expires at"
                        type="datetime-local"
                        value={data.expires_at}
                        onChange={(e) => setData('expires_at', e.target.value)}
                    />
                    <Button type="submit" loading={processing} className="w-full">
                        Create coupon
                    </Button>
                </form>

                <div className="card overflow-hidden lg:col-span-2">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Code</th>
                                <th className="table-header">Type</th>
                                <th className="table-header">Value</th>
                                <th className="table-header text-right">Used</th>
                                <th className="table-header"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(!coupons?.data || coupons.data.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-sm text-slate-500">
                                        No coupons yet.
                                    </td>
                                </tr>
                            ) : (
                                coupons.data.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td className="table-cell font-mono font-semibold">
                                            {coupon.code}
                                        </td>
                                        <td className="table-cell capitalize">{coupon.type}</td>
                                        <td className="table-cell">
                                            {coupon.type === 'percentage'
                                                ? `${coupon.value}%`
                                                : `$${coupon.value}`}
                                        </td>
                                        <td className="table-cell text-right">
                                            {coupon.used_count}
                                            {coupon.max_uses ? ` / ${coupon.max_uses}` : ''}
                                        </td>
                                        <td className="table-cell text-right">
                                            <button
                                                type="button"
                                                onClick={() => router.delete(route('marketing.coupons.destroy', coupon.id))}
                                                className="text-xs font-medium text-red-600 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
