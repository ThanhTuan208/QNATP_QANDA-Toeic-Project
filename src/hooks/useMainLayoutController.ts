'use client'

import { signOut, useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'

export function useMainLayoutController() {
  const { data: session } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isAuthenticated = !!session?.user

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])

  return {
    isAuthenticated,
    user: session?.user,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    handleLogout,
  }
}
