"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

function useInvalidateAll() {
    const queryClient = useQueryClient();
    return () => {
        ["patients", "doctors", "dashboard"].forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
        );
    };
}



export function usePatients(params) {
    return useQuery({
        queryKey: ["patients", "list", params],
        queryFn: () => api("/patients", { params }),
        placeholderData: keepPreviousData,
    });
}

export function usePatientFilterOptions() {
    return useQuery({
        queryKey: ["patients", "filter-options"],
        queryFn: async () => (await api("/patients/filter-options")).data,
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdatePatient(id) {
    const invalidateAll = useInvalidateAll();
    return useMutation({
        mutationFn: (body) => api(`/patients/${id}`, { method: "PUT", body }),
        onSuccess: () => { invalidateAll(); toast.success("Patient updated"); },
    });
}

export function useDeletePatient() {
    const invalidateAll = useInvalidateAll();
    return useMutation({
        mutationFn: (id) => api(`/patients/${id}`, { method: "DELETE" }),
        onSuccess: () => { invalidateAll(); toast.success("Patient deleted"); },
    });
}



export function useDoctorPatients(doctorId, params) {
    return useQuery({
        queryKey: ["patients", "doctor", doctorId, params],
        queryFn: () => api(`/doctors/${doctorId}/patients`, { params }),
        placeholderData: keepPreviousData,
    });
}

export function useAddPatient(doctorId) {
    const invalidateAll = useInvalidateAll();
    return useMutation({
        mutationFn: (body) => api(`/doctors/${doctorId}/patients`, { method: "POST", body }),
        onSuccess: () => { invalidateAll(); toast.success("Patient added"); },
    });
}

export function useRemoveDoctorPatient(doctorId) {
    const invalidateAll = useInvalidateAll();
    return useMutation({
        mutationFn: (patientId) =>
            api(`/doctors/${doctorId}/patients/${patientId}`, { method: "DELETE" }),
        onSuccess: () => { invalidateAll(); toast.success("Patient deleted"); },
    });
}