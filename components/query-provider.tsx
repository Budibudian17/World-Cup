'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let queryClient: QueryClient | null = null

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create QueryClient only on client side
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 60 * 24, // 24 hours - data dianggap segar
          gcTime: 1000 * 60 * 60 * 24, // 24 hours - cache disimpan di memori
          refetchOnWindowFocus: false, // Jangan hit API lagi saat user pindah tab dan kembali
          refetchOnMount: false, // Jangan hit API lagi jika komponen di-mount ulang
          refetchOnReconnect: false, // Jangan hit API lagi saat internet putus dan nyala lagi
        },
      },
    })
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
