import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <main className="grid min-h-screen place-items-center p-6 text-center">
            <div>
                <SearchX className="mx-auto size-12 text-slate-300" />
                <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
                <p className="mt-1 text-sm text-slate-500">The page you are looking for does not exist.</p>
                <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                    Go to dashboard
                </Link>
            </div>
        </main>
    );
}