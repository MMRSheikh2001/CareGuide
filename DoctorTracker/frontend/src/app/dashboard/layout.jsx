"use client";

import { useEffect, useState } from "react";
import { HeartPulse, Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Button from "@/components/ui/Button";
import { useUser } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }) {
    const { data: user, error, isPending, refetch } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);

    const unauthorized = error?.status === 401;

    useEffect(() => {
        if (!unauthorized) return;
        // Clear the stale cookie first, otherwise the proxy bounces us straight back
        api("/auth/logout", { method: "POST" })
            .catch(() => { })
            .finally(() => window.location.assign("/login"));
    }, [unauthorized]);

    if (error && !unauthorized) {
        return (
            <div className="grid min-h-screen place-items-center p-6 text-center">
                <div>
                    <HeartPulse className="mx-auto size-10 text-brand-600" />
                    <h1 className="mt-4 text-lg font-semibold">Can&apos;t reach the server</h1>
                    <p className="mt-1 text-sm text-slate-500">{error.message}</p>
                    <Button onClick={() => refetch()} className="mt-5">
                        Try again
                    </Button>
                </div>
            </div>
        );
    }

    if (isPending || unauthorized) {
        return (
            <div className="grid min-h-screen place-items-center">
                <Loader2 className="size-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
            <div className="lg:pl-64">
                <Topbar user={user} onMenuClick={() => setMenuOpen(true)} />
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}