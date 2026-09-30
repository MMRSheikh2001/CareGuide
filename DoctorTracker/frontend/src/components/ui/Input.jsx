export default function Input({ label, error, id, className = "", ...props }) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                aria-invalid={Boolean(error)}
                className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-2 focus:outline-offset-0 ${error
                        ? "border-red-400 focus:outline-red-500"
                        : "border-slate-300 focus:border-brand-500 focus:outline-brand-500/30"
                    }`}
                {...props}
            />
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}