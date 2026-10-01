import { TrendingDown, TrendingUp } from "lucide-react";

export function Change({ value, days }) {
    if (value === null || value === undefined) {
        return <span className="text-slate-400">No earlier data to compare</span>;
    }
    const up = value >= 0;
    const Icon = up ? TrendingUp : TrendingDown;
    return (
        <span className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 font-semibold ${up ? "text-emerald-600" : "text-red-600"}`}>
                <Icon className="size-3.5" />
                {up ? "+" : ""}{value}%
            </span>
            <span className="text-slate-400">vs previous {days} days</span>
        </span>
    );
}

export default function StatCard({ label, value, icon: Icon, footer }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
                </div>
                <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="size-5" />
                </span>
            </div>
            <div className="mt-4 text-xs">{footer}</div>
        </div>
    );
}