"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const ME_KEY = ["me"];

export function useUser() {
    return useQuery({
        queryKey: ME_KEY,
        queryFn: async () => (await api("/auth/me")).data,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials) =>
            api("/auth/login", { method: "POST", body: credentials }),
        onSuccess: (res) => queryClient.setQueryData(ME_KEY, res.data),
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api("/auth/logout", { method: "POST" }),
        onSettled: () => {
            queryClient.clear();
           
            window.location.assign("/login");
        },
    });
}