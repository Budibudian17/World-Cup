'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create new QueryClient instance for each component mount
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes - data dianggap segar
        gcTime: 1000 * 60 * 10, // 10 minutes - cache disimpan di memori
        refetchOnWindowFocus: false, // Jangan hit API lagi saat user pindah tab dan kembali
        refetchOnMount: true, // Hit API lagi jika komponen di-mount ulang (untuk fix navigation issue)
        refetchOnReconnect: false, // Jangan hit API lagi saat internet putus dan nyala lagi
      },
    },
  }))

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
