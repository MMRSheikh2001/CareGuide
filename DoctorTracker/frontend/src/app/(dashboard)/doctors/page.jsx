"use client";

import { useState } from "react";
import { Plus, SearchX, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";

import { useCreateDoctor, useDoctors, useDoctorFilterOptions } from "@/hooks/useDoctors";
import { formatDate } from "@/lib/format";
import Link from "next/link";

import DoctorFormModal from "@/components/doctors/DoctorFormModal";
import SearchInput from "@/components/ui/SearchInput";


const PAGE_SIZE = 10;
const emptyFilters = { search: "", specialization: "", hospital: "", from: "", to: "" };

export default function DoctorsPage() {
    const [filters, setFilters] = useState(emptyFilters);
    const [page, setPage] = useState(1);


    const params = { ...filters, page, limit: PAGE_SIZE };
    const { data, isPending, isFetching, error, refetch } = useDoctors(params);
    const { data: options } = useDoctorFilterOptions();
    const [addOpen, setAddOpen] = useState(false);
    const createDoctor = useCreateDoctor();

    const update = (name) => (e) => {
        setFilters((f) => ({ ...f, [name]: e.target.value }));
        setPage(1);
    };
    const clear = () => {
        setFilters(emptyFilters);
        setPage(1);
    };
    const hasFilters = Object.values(filters).some(Boolean);

    const inputCls =
        "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-2 focus:outline-brand-500/30";

    return (
        <>
            <PageHeader
                title="Doctors"
                description="Search, filter and manage your doctors"
                action={
                    <Button onClick={() => setAddOpen(true)}>
                        <Plus className="size-4" /> Add doctor
                    </Button>
                }
            />
            <DoctorFormModal open={addOpen} onClose={() => setAddOpen(false)} mutation={createDoctor} />

            {/* Filters */}
            <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                <SearchInput
                    label="Search"
                    value={filters.search}
                    onChange={(v) => {
                        setFilters((f) => ({ ...f, search: v }));
                        setPage(1);
                    }}
                    placeholder="Name, specialization or hospital"
                    className="sm:col-span-2"
                />

                <Select label="Specialization" id="spec" value={filters.specialization} onChange={update("specialization")}>
                    <option value="">All</option>
                    {options?.specializations.map((s) => <option key={s}>{s}</option>)}
                </Select>

                <Select label="Hospital" id="hospital" value={filters.hospital} onChange={update("hospital")}>
                    <option value="">All</option>
                    {options?.hospitals.map((h) => <option key={h}>{h}</option>)}
                </Select>

                <div>
                    <label htmlFor="from" className="mb-1.5 block text-xs font-medium text-slate-500">Added from</label>
                    <input id="from" type="date" value={filters.from} max={filters.to || undefined} onChange={update("from")} className={inputCls} />
                </div>
                <div>
                    <label htmlFor="to" className="mb-1.5 block text-xs font-medium text-slate-500">Added to</label>
                    <input id="to" type="date" value={filters.to} min={filters.from || undefined} onChange={update("to")} className={inputCls} />
                </div>

                {hasFilters && (
                    <div className="sm:col-span-2 lg:col-span-6">
                        <Button variant="ghost" onClick={clear} className="px-2 py-1.5">
                            <X className="size-4" /> Clear filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className={`overflow-x-auto transition-opacity ${isFetching && !isPending ? "opacity-60" : ""}`}>
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Doctor</th>
                                <th className="px-4 py-3 font-semibold">Specialization</th>
                                <th className="px-4 py-3 font-semibold">Hospital</th>
                                <th className="px-4 py-3 font-semibold">Phone</th>
                                <th className="px-4 py-3 text-center font-semibold">Patients</th>
                                <th className="px-4 py-3 font-semibold">Added</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isPending &&
                                Array.from({ length: 6 }, (_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }, (_, j) => (
                                            <td key={j} className="px-4 py-4">
                                                <div className="h-4 animate-pulse rounded bg-slate-100" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                            {data?.data.map((d) => (
                                <tr key={d._id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3.5">
                                        <Link href={`/doctors/${d._id}`} className="font-medium text-slate-900 hover:text-brand-700 hover:underline">
                                            {d.name}
                                        </Link>
                                        <p className="text-xs text-slate-500">{d.email}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                                            {d.specialization}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600">{d.hospital}</td>
                                    <td className="px-4 py-3.5 text-slate-600">{d.phone}</td>
                                    <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{d.patientCount}</td>
                                    <td className="px-4 py-3.5 text-slate-500">{formatDate(d.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {error && (
                    <div className="p-10 text-center">
                        <p className="text-sm text-red-600">{error.message}</p>
                        <Button variant="secondary" onClick={() => refetch()} className="mt-4">Try again</Button>
                    </div>
                )}

                {data?.data.length === 0 && (
                    <div className="p-12 text-center">
                        <SearchX className="mx-auto size-10 text-slate-300" />
                        <p className="mt-3 font-medium text-slate-700">No doctors found</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {hasFilters ? "Try changing or clearing your filters." : "Add your first doctor to get started."}
                        </p>
                    </div>
                )}

                <Pagination meta={data?.meta} onPageChange={setPage} />
            </div>
        </>
    );
}