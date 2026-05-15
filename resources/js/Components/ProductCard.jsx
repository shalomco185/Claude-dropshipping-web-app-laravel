import { Link } from '@inertiajs/react';
import Badge from './Badge';

export default function ProductCard({ product }) {
    const thumbnail =
        Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : 'https://via.placeholder.com/600x600/e2e8f0/94a3b8?text=No+Image';

    const statusColor = {
        active: 'green',
        draft: 'gray',
        archived: 'yellow',
    }[product.status] ?? 'gray';

    return (
        <Link href={route('products.edit', product.id)} className="group card overflow-hidden hover:shadow-lg transition">
            <div className="aspect-square w-full overflow-hidden bg-slate-100">
                <img
                    src={thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                />
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
                        {product.title}
                    </h3>
                    <Badge color={statusColor}>{product.status}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-base font-semibold text-slate-900">
                        ${Number(product.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">{product.stock} in stock</p>
                </div>
            </div>
        </Link>
    );
}
