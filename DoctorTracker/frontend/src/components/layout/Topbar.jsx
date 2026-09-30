

"use client";

import { LogOut, Menu } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLogout } from "@/hooks/useAuth";

export default function Topbar({ user, onMenuClick }) {
    const logout = useLogout();
    const initials = user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button
                onClick={onMenuClick}
                aria-label="Open menu"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
                <Menu className="size-6" />
            </button>

            <div className="ml-auto flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="grid size-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {initials}
                </span>
                <Button
                    variant="secondary"
                    onClick={() => logout.mutate()}
                    loading={logout.isPending}
                    className="px-3"
                >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    );
}