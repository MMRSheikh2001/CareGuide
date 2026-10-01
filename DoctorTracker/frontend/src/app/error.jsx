

"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ErrorPage({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="grid min-h-screen place-items-center p-6 text-center">
            <div>
                <TriangleAlert className="mx-auto size-12 text-amber-500" />
                <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
                <p className="mt-1 text-sm text-slate-500">An unexpected error occurred. Please try again.</p>
                <Button onClick={reset} className="mt-6">Try again</Button>
            </div>
        </main>
    );
}