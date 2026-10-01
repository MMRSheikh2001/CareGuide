"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, Mail, Phone, Plus, Trash2, UserX } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import PatientFormModal from "@/components/patients/PatientFormModal";

import { useDoctor } from "@/hooks/useDoctors";
import { useAddPatient, useDoctorPatients, useRemoveDoctorPatient } from "@/hooks/usePatients";
import { formatDate } from "@/lib/format";
import SearchInput from "@/components/ui/SearchInput";

const PAGE_SIZE = 8;

export default function DoctorDetailPage() {
    const { id } = useParams();
    const { data: doctor, isPending, error } = useDoctor(id);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [addOpen, setAddOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);


    const patients = useDoctorPatients(id, { search, page, limit: PAGE_SIZE })
    const addPatient = useAddPatient(id);
    const removePatient = useRemoveDoctorPatient(id);

    // If the last patient on the last page is deleted, step back a page
    const totalPages = patients.data?.meta.totalPages;
    useEffect(() => {
        if (totalPages && page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    if (isPending) {
        return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;
    }

    if (error) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                <UserX className="mx-auto size-10 text-slate-300" />
                <p className="mt-3 font-medium">
                    {error.status === 404 || error.status === 400 ? "Doctor not found" : error.message}
                </p>
                <Link href="/doctors" className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline">
                    Back to doctors
                </Link>
            </div>
        );
    }

    const info = [
        { icon: Building2, text: doctor.hospital },
        { icon: Phone, text: doctor.phone },
        { icon: Mail, text: doctor.email },
    ];

    return (
        <>
            <Link href="/doctors" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700">
                <ArrowLeft className="size-4" /> Doctors
            </Link>

            {/* Doctor summary */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{doctor.name}</h1>
                        <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                            {doctor.specialization}
                        </span>
                    </div>
                    <div className="flex gap-6 text-center">
                        <div>
                            <p className="text-2xl font-bold text-brand-700">{doctor.patientCount}</p>
                            <p className="text-xs text-slate-500">Patients</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{formatDate(doctor.createdAt)}</p>
                            <p className="text-xs text-slate-500">Added</p>
                        </div>
                    </div>
                </div>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {info.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2">
                            <Icon className="size-4 text-slate-400" /> {text}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Patients */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold">Patients</h2>
                    <div className="flex gap-3">
                        <SearchInput
                            id="patient-search"
                            value={search}
                            onChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            placeholder="Search patients"
                            className="flex-1 sm:w-64"
                        />
                        <Button onClick={() => setAddOpen(true)}>
                            <Plus className="size-4" /> <span className="hidden sm:inline">Add patient</span>
                        </Button>
                    </div>
                </div>

                <div className={`overflow-x-auto transition-opacity ${patients.isFetching && !patients.isPending ? "opacity-60" : ""}`}>
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Patient</th>
                                <th className="px-4 py-3 font-semibold">Age</th>
                                <th className="px-4 py-3 font-semibold">Gender</th>
                                <th className="px-4 py-3 font-semibold">Condition</th>
                                <th className="px-4 py-3 font-semibold">Added</th>
                                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.isPending &&
                                Array.from({ length: 4 }, (_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }, (_, j) => (
                                            <td key={j} className="px-4 py-4"><div className="h-4 animate-pulse rounded bg-slate-100" /></td>
                                        ))}
                                    </tr>
                                ))}
                            {patients.data?.data.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3.5">
                                        <p className="font-medium">{p.name}</p>
                                        {p.phone && <p className="text-xs text-slate-500">{p.phone}</p>}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600">{p.age}</td>
                                    <td className="px-4 py-3.5 capitalize text-slate-600">{p.gender}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{p.condition}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">{formatDate(p.createdAt)}</td>
                                    <td className="px-4 py-3.5 text-right">
                                        <button
                                            onClick={() => setToDelete(p)}
                                            aria-label={`Delete ${p.name}`}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {patients.error && (
                    <p className="p-8 text-center text-sm text-red-600">{patients.error.message}</p>
                )}
                {patients.data?.data.length === 0 && (
                    <div className="p-12 text-center">
                        <UserX className="mx-auto size-10 text-slate-300" />
                        <p className="mt-3 font-medium text-slate-700">No patients found</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {search ? "Try a different search." : "Add this doctor's first patient."}
                        </p>
                    </div>
                )}

                <Pagination meta={patients.data?.meta} onPageChange={setPage} />
            </div>

            <PatientFormModal open={addOpen} onClose={() => setAddOpen(false)} mutation={addPatient} />

            <ConfirmDialog
                open={Boolean(toDelete)}
                title="Delete patient"
                message={`Delete ${toDelete?.name}? This cannot be undone.`}
                loading={removePatient.isPending}
                error={removePatient.error}
                onCancel={() => {
                    setToDelete(null);
                    removePatient.reset();
                }}
                onConfirm={() =>
                    removePatient.mutate(toDelete._id, { onSuccess: () => setToDelete(null) })
                }
            />
        </>
    );
}