import { forwardRef } from 'react';

const Input = forwardRef(function Input(
    { label, error, hint, className = '', id, ...props },
    ref,
) {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={className}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                className={`block w-full rounded-lg border-slate-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                {...props}
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
        </div>
    );
});

export default Input;
