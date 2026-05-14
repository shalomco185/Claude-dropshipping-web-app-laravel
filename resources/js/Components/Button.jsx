import { forwardRef } from 'react';

const variants = {
    primary:
        'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm',
    secondary:
        'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-primary-500 shadow-sm',
    danger:
        'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm',
    ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-primary-500',
    success:
        'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-sm',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
};

const Button = forwardRef(function Button(
    {
        type = 'button',
        variant = 'primary',
        size = 'md',
        className = '',
        loading = false,
        disabled = false,
        children,
        ...props
    },
    ref,
) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
});

export default Button;
