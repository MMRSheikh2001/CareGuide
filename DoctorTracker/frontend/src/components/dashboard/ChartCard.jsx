

import { BarChart3 } from "lucide-react";

export default function ChartCard({ title, subtitle, empty, className = "", children }) {
    return (
        <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
            <h2 className="font-semibold">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
            <div className="mt-4 h-72">
                {empty ? (
                    <div className="grid h-full place-items-center text-center">
                        <div>
                            <BarChart3 className="mx-auto size-9 text-slate-300" />
                            <p className="mt-2 text-sm text-slate-500">No data yet</p>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </section>
    );
}