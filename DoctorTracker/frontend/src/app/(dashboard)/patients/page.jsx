"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Search, Trash2, UserX, X } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PatientFormModal from "@/components/patients/PatientFormModal";
import useDebounce from "@/hooks/useDebounce";
import { useDoctorOptions } from "@/hooks/useDoctors";
import {
    useDeletePatient,
    usePatientFilterOptions,
    usePatients,
    useUpdatePatient,
} from "@/hooks/usePatients";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 10;
const emptyFilters = { search: "", condition: "", gender: "", doctor: "", from: "", to: "" };

export default function PatientsPage() {
    const [filters, setFilters] = useState(emptyFilters);
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const debouncedSearch = useDebounce(filters.search);

    const params = { ...filters, search: debouncedSearch, page, limit: PAGE_SIZE };
    const { data, isPending, isFetching, error, refetch } = usePatients(params);
    const { data: options } = usePatientFilterOptions();
    const { data: doctors } = useDoctorOptions();

    const updatePatient = useUpdatePatient(editing?._id);
    const deletePatient = useDeletePatient();

    const update = (name) => (e) => {
        setFilters((f) => ({ ...f, [name]: e.target.value }));
        setPage(1);
    };
    const clear = () => {
        setFilters(emptyFilters);
        setPage(1);
    };
    const hasFilters = Object.values(filters).some(Boolean);

    // If the last patient on the last page is deleted, step back a page
    const totalPages = data?.meta.totalPages;
    useEffect(() => {
        if (totalPages && page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const inputCls =
        "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-2 focus:outline-brand-500/30";

    return (
        <>
            <PageHeader
                title="Patients"
                description="Search, filter, edit and manage all patients"
            />

            {/* Filters */}
            <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                <div className="relative sm:col-span-2">
                    <label htmlFor="search" className="mb-1.5 block text-xs font-medium text-slate-500">Search</label>
                    <Search className="pointer-events-none absolute bottom-3 left-3 size-4 text-slate-400" />
                    <input
                        id="search"
                        value={filters.search}
                        onChange={update("search")}
                        placeholder="Name, condition or phone"
                        className={`${inputCls} pl-9`}
                    />
                </div>

                <Select label="Condition" id="condition" value={filters.condition} onChange={update("condition")}>
                    <option value="">All</option>
                    {options?.conditions.map((c) => <option key={c}>{c}</option>)}
                </Select>

                <Select label="Gender" id="gender" value={filters.gender} onChange={update("gender")}>
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </Select>

                <Select label="Doctor" id="doctor" value={filters.doctor} onChange={update("doctor")} className="sm:col-span-2 lg:col-span-1">
                    <option value="">All</option>
                    {doctors?.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
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
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Patient</th>
                                <th className="px-4 py-3 font-semibold">Age</th>
                                <th className="px-4 py-3 font-semibold">Gender</th>
                                <th className="px-4 py-3 font-semibold">Condition</th>
                                <th className="px-4 py-3 font-semibold">Doctor</th>
                                <th className="px-4 py-3 font-semibold">Added</th>
                                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isPending &&
                                Array.from({ length: 6 }, (_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 7 }, (_, j) => (
                                            <td key={j} className="px-4 py-4"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>
                                        ))}
                                    </tr>
                                ))}

                            {data?.data.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3.5">
                                        <p className="font-medium text-slate-900">{p.name}</p>
                                        {p.phone && <p className="text-xs text-slate-500">{p.phone}</p>}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600">{p.age}</td>
                                    <td className="px-4 py-3.5 capitalize text-slate-600">{p.gender}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{p.condition}</span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {p.doctor ? (
                                            <Link href={`/doctors/${p.doctor._id}`} className="text-slate-700 hover:text-brand-700 hover:underline">
                                                {p.doctor.name}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">{formatDate(p.createdAt)}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => setEditing(p)}
                                                aria-label={`Edit ${p.name}`}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-700"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => setToDelete(p)}
                                                aria-label={`Delete ${p.name}`}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
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
                        <UserX className="mx-auto size-10 text-slate-300" />
                        <p className="mt-3 font-medium text-slate-700">No patients found</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {hasFilters ? "Try changing or clearing your filters." : "Patients are added from a doctor's page."}
                        </p>
                    </div>
                )}

                <Pagination meta={data?.meta} onPageChange={setPage} />
            </div>

            <PatientFormModal
                open={Boolean(editing)}
                onClose={() => setEditing(null)}
                mutation={updatePatient}
                doctors={doctors}
                title="Edit patient"
                submitLabel="Save changes"
                initial={
                    editing && {
                        name: editing.name,
                        age: String(editing.age),
                        gender: editing.gender,
                        phone: editing.phone || "",
                        condition: editing.condition,
                        doctor: editing.doctor?._id || "",
                    }
                }
            />

            <ConfirmDialog
                open={Boolean(toDelete)}
                title="Delete patient"
                message={`Delete ${toDelete?.name}? This cannot be undone.`}
                loading={deletePatient.isPending}
                error={deletePatient.error}
                onCancel={() => {
                    setToDelete(null);
                    deletePatient.reset();
                }}
                onConfirm={() =>
                    deletePatient.mutate(toDelete._id, { onSuccess: () => setToDelete(null) })
                }
            />
        </>
    );
}