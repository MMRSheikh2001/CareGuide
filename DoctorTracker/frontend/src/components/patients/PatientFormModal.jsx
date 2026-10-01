"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { validatePatient } from "@/lib/validators";

const empty = { name: "", age: "", gender: "", phone: "", condition: "", doctor: "" };

function PatientForm({ initial, doctors, mutation, onSubmit, onCancel, submitLabel }) {
    const [values, setValues] = useState({ ...empty, ...initial });
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
        const found = validatePatient(values);
        if (doctors && !values.doctor) found.doctor = "Select a doctor";
        setErrors(found);
        if (Object.keys(found).length) return;

        const body = {
            name: values.name.trim(),
            age: Number(values.age),
            gender: values.gender,
            condition: values.condition.trim(),
            phone: values.phone.trim(), // empty string lets the user clear a phone number
        };
        if (doctors) body.doctor = values.doctor;
        onSubmit(body);
    };

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            {serverError && !serverError.errors?.length && (
                <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                    {serverError.message}
                </div>
            )}

            <Input id="p-name" name="name" label="Full name" value={values.name} onChange={change} error={fieldError("name")} autoFocus />
            <div className="grid gap-4 sm:grid-cols-2">
                <Input id="p-age" name="age" type="number" min="0" max="150" label="Age" value={values.age} onChange={change} error={fieldError("age")} />
                <div>
                    <Select id="p-gender" name="gender" label="Gender" value={values.gender} onChange={change}>
                        <option value="">Select…</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </Select>
                    {fieldError("gender") && <p className="mt-1.5 text-sm text-red-600">{fieldError("gender")}</p>}
                </div>
            </div>
            <Input id="p-condition" name="condition" label="Condition" placeholder="Hypertension" value={values.condition} onChange={change} error={fieldError("condition")} />
            <Input id="p-phone" name="phone" type="tel" label="Phone (optional)" placeholder="+8801811000000" value={values.phone} onChange={change} error={fieldError("phone")} />

            {doctors && (
                <div>
                    <Select id="p-doctor" name="doctor" label="Doctor" value={values.doctor} onChange={change}>
                        <option value="">Select…</option>
                        {doctors.map((d) => (
                            <option key={d._id} value={d._id}>
                                {d.name} — {d.specialization}
                            </option>
                        ))}
                    </Select>
                    {fieldError("doctor") && <p className="mt-1.5 text-sm text-red-600">{fieldError("doctor")}</p>}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" loading={mutation.isPending}>{submitLabel}</Button>
            </div>
        </form>
    );
}

export default function PatientFormModal({
    open,
    onClose,
    mutation,
    doctors,
    title = "Add patient",
    submitLabel = "Add patient",
    initial,
}) {
    const close = () => {
        mutation.reset();
        onClose();
    };

    return (
        <Modal open={open} onClose={close} title={title}>
            <PatientForm
                initial={initial}
                doctors={doctors}
                mutation={mutation}
                submitLabel={submitLabel}
                onCancel={close}
                onSubmit={(values) => mutation.mutate(values, { onSuccess: close })}
            />
        </Modal>
    );
}