'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import { Toaster } from '@/components/ui/feedback/sonner'
import { SidebarProvider } from '@/contexts/SidebarContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          {children}
          <Toaster />
        </SidebarProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
