"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export default function SearchInput({
    id = "search",
    label,
    value,
    onChange,
    placeholder,
    delay = 400,
    className = "",
}) {
    const [text, setText] = useState(value);
    const timer = useRef(null);

    // Pick up outside changes (e.g. "Clear filters")
    useEffect(() => {
        clearTimeout(timer.current);
        setText(value);
    }, [value]);

    useEffect(() => () => clearTimeout(timer.current), []);

    const handle = (e) => {
        const next = e.target.value;
        setText(next);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => onChange(next), delay);
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-500">
                    {label}
                </label>
            )}
            <Search className={`pointer-events-none absolute left-3 size-4 text-slate-400 ${label ? "bottom-3" : "top-1/2 -translate-y-1/2"}`} />
            <input
                id={id}
                value={text}
                onChange={handle}
                placeholder={placeholder}
                aria-label={label ? undefined : placeholder}
                className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm focus:border-brand-500 focus:outline-2 focus:outline-brand-500/30"
            />
        </div>
    );
}