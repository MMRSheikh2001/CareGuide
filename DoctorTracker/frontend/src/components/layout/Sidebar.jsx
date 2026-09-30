

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, LayoutDashboard, Stethoscope, Users } from "lucide-react";

const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/doctors", label: "Doctors", icon: Stethoscope },
    { href: "/patients", label: "Patients", icon: Users },
];

export default function Sidebar({ open, onClose }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile backdrop */}
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-6 text-lg font-bold text-brand-700">
                    <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-white">
                        <HeartPulse className="size-5" />
                    </span>
                    Doctor Tracker
                </div>

                <nav className="flex-1 space-y-1 p-4" aria-label="Main">
                    {links.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(`${href}/`);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                <Icon className={`size-5 ${active ? "text-brand-600" : "text-slate-400"}`} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}