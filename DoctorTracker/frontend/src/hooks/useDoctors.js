
"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";


export function useDoctors(params) {
    return useQuery({
        queryKey: ["doctors", params],
        queryFn: () => api("/doctors", { params }),
        placeholderData: keepPreviousData,
    });
}

export function useDoctorFilterOptions() {
    return useQuery({
        queryKey: ["doctors", "filter-options"],
        queryFn: async () => (await api("/doctors/filter-options")).data,
        staleTime: 5 * 60 * 1000,
    });
}

export function useDoctor(id) {
    return useQuery({
        queryKey: ["doctors", "detail", id],
        queryFn: async () => (await api(`/doctors/${id}`)).data,
        retry: false,
    });
}

export function useCreateDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body) => api("/doctors", { method: "POST", body }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}

export function useDoctorOptions() {
    return useQuery({
        queryKey: ["doctors", "options"],
        queryFn: async () => (await api("/doctors", { params: { limit: 50 } })).data,
        staleTime: 5 * 60 * 1000,
    });
}