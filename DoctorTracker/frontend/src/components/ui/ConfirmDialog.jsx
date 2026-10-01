

"use client";

import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Delete",
    loading,
    error,
    onConfirm,
    onCancel,
}) {
    return (
        <Modal open={open} onClose={onCancel} title={title}>
            <p className="text-sm text-slate-600">{message}</p>
            {error && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error.message}
                </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} loading={loading}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}