
"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDashboard(days) {
    return useQuery({
        queryKey: ["dashboard", days],
        queryFn: async () => (await api("/dashboard/stats", { params: { days } })).data,
        placeholderData: keepPreviousData,
    });
}