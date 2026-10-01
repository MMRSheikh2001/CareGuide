

"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { validateDoctor } from "@/lib/validators";

const empty = { name: "", specialization: "", hospital: "", phone: "", email: "" };

function DoctorForm({ mutation, onSubmit, onCancel }) {
    const [values, setValues] = useState(empty);
    const [errors, setErrors] = useState({});
    const serverError = mutation.error;

    const fieldError = (name) =>
        errors[name] || serverError?.errors?.find((e) => e.field === name)?.message;

    const change = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
        setErrors((er) => ({ ...er, [name]: undefined }));
    };

    const submit = (e) => {
        e.preventDefault();
        const found = validateDoctor(values);
        setErrors(found);
        if (Object.keys(found).length) return;
        onSubmit(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])));
    };

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            {serverError && !serverError.errors?.length && (
                <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                    {serverError.message}
                </div>
            )}

            <Input id="name" name="name" label="Full name" placeholder="Dr. Ayesha Rahman" value={values.name} onChange={change} error={fieldError("name")} autoFocus />
            <div className="grid gap-4 sm:grid-cols-2">
                <Input id="specialization" name="specialization" label="Specialization" placeholder="Cardiology" value={values.specialization} onChange={change} error={fieldError("specialization")} />
                <Input id="hospital" name="hospital" label="Hospital" placeholder="Square Hospital" value={values.hospital} onChange={change} error={fieldError("hospital")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <Input id="phone" name="phone" type="tel" label="Phone" placeholder="+8801711000000" value={values.phone} onChange={change} error={fieldError("phone")} />
                <Input id="email" name="email" type="email" label="Email" placeholder="doctor@example.com" value={values.email} onChange={change} error={fieldError("email")} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={mutation.isPending}>Add doctor</Button>
            </div>
        </form>
    );
}

export default function DoctorFormModal({ open, onClose, mutation }) {
    const close = () => {
        mutation.reset();
        onClose();
    };

    return (
        <Modal open={open} onClose={close} title="Add doctor">
            <DoctorForm
                mutation={mutation}
                onCancel={close}
                onSubmit={(values) => mutation.mutate(values, { onSuccess: close })}
            />
        </Modal>
    );
}