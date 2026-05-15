import Badge from './Badge';

const statusMap = {
    pending: { color: 'yellow', label: 'Pending' },
    processing: { color: 'blue', label: 'Processing' },
    shipped: { color: 'indigo', label: 'Shipped' },
    delivered: { color: 'green', label: 'Delivered' },
    cancelled: { color: 'red', label: 'Cancelled' },
    refunded: { color: 'red', label: 'Refunded' },
};

export default function OrderStatusBadge({ status }) {
    const cfg = statusMap[status] ?? { color: 'gray', label: status };

    return <Badge color={cfg.color}>{cfg.label}</Badge>;
}
