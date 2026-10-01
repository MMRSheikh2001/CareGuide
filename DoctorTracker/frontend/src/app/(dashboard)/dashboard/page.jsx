"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Stethoscope, UserPlus, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatCard, { Change } from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import { DonutChart, HBarChart, TrendChart, VBarChart } from "@/components/dashboard/charts";
import { useDashboard } from "@/hooks/useDashboard";
import { formatDate } from "@/lib/format";

const RANGES = [7, 30, 90];

function RangeSwitch({ value, onChange }) {
    return (
        <div role="group" aria-label="Date range" className="inline-flex rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200">
            {RANGES.map((d) => (
                <button
                    key={d}
                    onClick={() => onChange(d)}
                    aria-pressed={value === d}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition ${value === d ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                >
                    {d} days
                </button>
            ))}
        </div>
    );
}

function Skeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-200/60" />
                ))}
            </div>
            <div className="h-96 animate-pulse rounded-xl bg-slate-200/60" />
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-96 animate-pulse rounded-xl bg-slate-200/60" />
                <div className="h-96 animate-pulse rounded-xl bg-slate-200/60" />
            </div>
        </div>
    );
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function DashboardPage() {
    const [days, setDays] = useState(30);
    const { data, isPending, isFetching, error, refetch } = useDashboard(days);

    const header = (
        <PageHeader
            title="Dashboard"
            description="Overview of your doctors and patients"
            action={<RangeSwitch value={days} onChange={setDays} />}
        />
    );

    if (isPending) {
        return (
            <>
                {header}
                <Skeleton />
            </>
        );
    }

    if (error) {
        return (
            <>
                {header}
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                    <p className="text-sm text-red-600">{error.message}</p>
                    <Button variant="secondary" onClick={() => refetch()} className="mt-4">Try again</Button>
                </div>
            </>
        );
    }

    const { totals, recentPatients } = data;
    const trend = data.patientsOverTime.map((p, i) => ({
        date: p.date,
        patients: p.count,
        doctors: data.doctorsOverTime[i]?.count ?? 0,
    }));
    const gender = data.patientsByGender.map((g) => ({ ...g, label: capitalize(g.label) }));
    const hasTrend = trend.some((t) => t.patients || t.doctors);

    return (
        <>
            {header}

            <div className={`space-y-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total doctors"
                        value={totals.doctors}
                        icon={Stethoscope}
                        footer={<Change value={totals.doctorsChange} days={days} />}
                    />
                    <StatCard
                        label="Total patients"
                        value={totals.patients}
                        icon={Users}
                        footer={<Change value={totals.patientsChange} days={days} />}
                    />
                    <StatCard
                        label={`New patients (${days} days)`}
                        value={totals.newPatients}
                        icon={UserPlus}
                        footer={<span className="text-slate-400">{totals.newDoctors} new doctors in this period</span>}
                    />
                    <StatCard
                        label="Avg patients per doctor"
                        value={totals.avgPatientsPerDoctor}
                        icon={Activity}
                        footer={<span className="text-slate-400">Across all doctors</span>}
                    />
                </div>

                {/* Trend */}
                <ChartCard
                    title="New patients and doctors over time"
                    subtitle={`Daily counts for the last ${days} days`}
                    empty={!hasTrend}
                >
                    <TrendChart data={trend} />
                </ChartCard>

                {/* Breakdowns */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <ChartCard title="Patients per doctor" subtitle="Top 8 doctors" empty={!data.patientsPerDoctor.length}>
                        <HBarChart data={data.patientsPerDoctor} nameKey="name" />
                    </ChartCard>
                    <ChartCard title="Doctors by specialization" empty={!data.doctorsBySpecialization.length}>
                        <HBarChart data={data.doctorsBySpecialization} nameKey="label" color="#38bdf8" label="Doctors" />
                    </ChartCard>
                    <ChartCard title="Patients by condition" subtitle="Top 6 conditions" empty={!data.patientsByCondition.length}>
                        <DonutChart data={data.patientsByCondition} />
                    </ChartCard>
                    <ChartCard title="Patients by gender" empty={!gender.length}>
                        <DonutChart data={gender} />
                    </ChartCard>
                    <ChartCard title="Patients by age group" empty={!totals.patients} className="lg:col-span-2">
                        <VBarChart data={data.patientsByAgeGroup} nameKey="label" />
                    </ChartCard>
                </div>

                {/* Recent patients */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="font-semibold">Latest patients</h2>
                        <Link href="/patients" className="text-sm font-medium text-brand-700 hover:underline">View all</Link>
                    </div>
                    {recentPatients.length === 0 ? (
                        <p className="p-10 text-center text-sm text-slate-500">No patients yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">Patient</th>
                                        <th className="px-5 py-3 font-semibold">Condition</th>
                                        <th className="px-5 py-3 font-semibold">Doctor</th>
                                        <th className="px-5 py-3 font-semibold">Added</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentPatients.map((p) => (
                                        <tr key={p._id} className="hover:bg-slate-50">
                                            <td className="px-5 py-3.5 font-medium">{p.name}</td>
                                            <td className="px-5 py-3.5">
                                                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{p.condition}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600">{p.doctor?.name ?? "—"}</td>
                                            <td className="px-5 py-3.5 text-slate-500">{formatDate(p.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}