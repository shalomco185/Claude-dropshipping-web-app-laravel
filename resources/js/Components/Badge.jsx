const colors = {
    gray: 'bg-slate-100 text-slate-700 ring-slate-600/20',
    red: 'bg-red-50 text-red-700 ring-red-600/20',
    yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    pink: 'bg-pink-50 text-pink-700 ring-pink-600/20',
};

export default function Badge({ children, color = 'gray', className = '' }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colors[color] ?? colors.gray} ${className}`}
        >
            {children}
        </span>
    );
}
