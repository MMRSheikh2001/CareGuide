"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, ShieldCheck, BarChart3, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLogin } from "@/hooks/useAuth";

const features = [
    { icon: Users, text: "Manage doctors and their patients in one place" },
    { icon: BarChart3, text: "Live analytics and trends on your dashboard" },
    { icon: ShieldCheck, text: "Secure, admin-only access" },
];

export default function LoginPage() {
    const router = useRouter();
    const login = useLogin();
    const [form, setForm] = useState({ email: "", password: "" });

    const fieldError = (name) =>
        login.error?.errors?.find((e) => e.field === name)?.message;

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        login.mutate(form, { onSuccess: () => router.replace("/dashboard") });
    };

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Brand panel */}
            <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-sky-600 p-12 text-white lg:flex">
                <div className="flex items-center gap-2.5 text-xl font-bold">
                    <HeartPulse className="size-7" /> Doctor Tracker
                </div>
                <div>
                    <h2 className="text-4xl font-bold leading-tight">
                        Care teams, organised.
                    </h2>
                    <ul className="mt-8 space-y-4">
                        {features.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3 text-brand-50">
                                <span className="grid size-9 place-items-center rounded-lg bg-white/15">
                                    <Icon className="size-5" />
                                </span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-sm text-brand-100">Admin portal</p>
                <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-white/5" />
            </section>

            {/* Form */}
            <section className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2 text-xl font-bold text-brand-700 lg:hidden">
                        <HeartPulse className="size-6" /> Doctor Tracker
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Sign in to manage doctors and patients.
                    </p>

                    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
                        {login.error && !login.error.errors?.length && (
                            <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                                {login.error.message}
                            </div>
                        )}

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="admin@example.com"
                            autoComplete="email"
                            autoFocus
                            value={form.email}
                            onChange={onChange}
                            error={fieldError("email")}
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={onChange}
                            error={fieldError("password")}
                        />

                        <Button type="submit" loading={login.isPending} className="w-full">
                            Sign in
                        </Button>
                    </form>
                </div>
            </section>
        </main>
    );
}