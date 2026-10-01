
export default function Select({ label, id, children, className = "", ...props }) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-500">
                    {label}
                </label>
            )}
            <select
                id={id}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-2 focus:outline-brand-500/30"
                {...props}
            >
                {children}
            </select>
        </div>
    );
}