"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export default function Providers({ children }) {
  
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30 * 1000,
                        refetchOnWindowFocus: false,
                        retry: (count, error) => error.status !== 401 && count < 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={client}>
            {children}
            <Toaster richColors closeButton position="top-right" />
        </QueryClientProvider>
    );
}