import { useState } from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ThemeProvider } from "./theme-provider";

import { Toaster } from "sonner";

export function AppProvider({children}: {children: React.ReactNode}) {
    const [queryClient] = useState(() => new QueryClient({defaultOptions: {queries: {
        staleTime: 30_000, refetchOnWindowFocus: false, retry: 1
    }, mutations: {
        retry: 0
    }}}))

    return <ThemeProvider>

        <QueryClientProvider
        client={queryClient}
        >
            {children}
            <Toaster position="top-right" richColors closeButton/>

        </QueryClientProvider>
    </ThemeProvider>
}