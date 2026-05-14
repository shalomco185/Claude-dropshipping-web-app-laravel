import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import OrderStatusBadge from '@/Components/OrderStatusBadge';

export default function OrderShow({ order }) {
    const { data, setData, post, processing } = useForm({
        action: 'process',
        tracking_number: order.tracking_number ?? '',
        tracking_url: order.tracking_url ?? '',
        reason: '',
    });

    const fulfillAction = (action) => {
        setData('action', action);
        setTimeout(() => {
            router.post(
                route('orders.fulfill', order.id),
                {
                    action,
                    tracking_number: data.tracking_number,
                    tracking_url: data.tracking_url,
                    reason: data.reason,
                },
                { preserveScroll: true },
            );
        }, 0);
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency || 'USD' }).format(
            Number(value || 0),
        );

    return (
        <AppLayout title={`Order #${order.order_number}`}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Order #{order.order_number}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Placed {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <Link href={route('orders.index')}>
                        <Button variant="secondary">Back</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="card p-6">
                        <h3 className="mb-4 text-base font-semibold text-slate-900">Items</h3>
                        <ul className="divide-y divide-slate-100">
                            {(order.items ?? []).map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 py-3">
                                    <img
                                        src={item.image ?? 'https://via.placeholder.com/64?text=I'}
                                        alt={item.title ?? 'Item'}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">
                                            {item.title ?? `Item #${idx + 1}`}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Qty {item.quantity ?? 1}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold">
                                        {formatCurrency(item.price ?? 0)}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Shipping</span>
                                <span>{formatCurrency(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tax</span>
                                <span>{formatCurrency(order.tax)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="mb-4 text-base font-semibold text-slate-900">Fulfillment</h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Input
                                label="Tracking number"
                                value={data.tracking_number}
                                onChange={(e) => setData('tracking_number', e.target.value)}
                            />
                            <Input
                                label="Tracking URL"
                                value={data.tracking_url}
                                onChange={(e) => setData('tracking_url', e.target.value)}
                            />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button onClick={() => fulfillAction('process')} loading={processing}>
                                Mark processing
                            </Button>
                            <Button
                                onClick={() => fulfillAction('ship')}
                                variant="secondary"
                            >
                                Mark shipped
                            </Button>
                            <Button
                                onClick={() => fulfillAction('deliver')}
                                variant="secondary"
                            >
                                Mark delivered
                            </Button>
                            <Button onClick={() => fulfillAction('cancel')} variant="danger">
                                Cancel order
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6">
                        <h3 className="mb-3 text-base font-semibold text-slate-900">Customer</h3>
                        <p className="text-sm font-medium text-slate-900">
                            {order.customer?.name ?? 'Guest'}
                        </p>
                        <p className="text-sm text-slate-500">{order.customer?.email}</p>
                    </div>

                    <div className="card p-6">
                        <h3 className="mb-3 text-base font-semibold text-slate-900">Shipping address</h3>
                        {order.shipping_address ? (
                            <div className="text-sm text-slate-600">
                                <p>{order.shipping_address.line1}</p>
                                <p>
                                    {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                    {order.shipping_address.postal_code}
                                </p>
                                <p>{order.shipping_address.country}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">No address provided.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
