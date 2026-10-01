import { ChevronLeft, ChevronRight } from "lucide-react";

// 1 … 4 5 6 … 20
function pageItems(page, totalPages) {
    const wanted = [1, page - 1, page, page + 1, totalPages]
        .filter((p) => p >= 1 && p <= totalPages);
    const sorted = [...new Set(wanted)].sort((a, b) => a - b);

    const items = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) items.push(`gap-${p}`);
        items.push(p);
    });
    return items;
}

export default function Pagination({ meta, onPageChange }) {
    if (!meta || meta.total === 0) return null;

    const { page, limit, total, totalPages } = meta;
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    const btn =
        "grid size-9 place-items-center rounded-lg text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row">
            <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{from}–{to}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span>
            </p>

            <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                    className={`${btn} text-slate-600 hover:bg-slate-100`}
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="size-4" />
                </button>

                {pageItems(page, totalPages).map((item) =>
                    typeof item === "string" ? (
                        <span key={item} className="px-1 text-slate-400">…</span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            aria-current={item === page ? "page" : undefined}
                            className={`${btn} ${item === page
                                    ? "bg-brand-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {item}
                        </button>
                    )
                )}

                <button
                    className={`${btn} text-slate-600 hover:bg-slate-100`}
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    aria-label="Next page"
                >
                    <ChevronRight className="size-4" />
                </button>
            </nav>
        </div>
    );
}