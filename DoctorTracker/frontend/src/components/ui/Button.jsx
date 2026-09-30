import { Loader2 } from "lucide-react";

const variants = {
    primary:
        "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600",
    secondary:
        "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-brand-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    ghost: "text-slate-600 hover:bg-slate-100 focus-visible:outline-brand-600",
};

export default function Button({
    variant = "primary",
    loading = false,
    disabled,
    className = "",
    children,
    ...props
}) {
    return (
        <button
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
            {...props}
        >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {children}
        </button>
    );
}