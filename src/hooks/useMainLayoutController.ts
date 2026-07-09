'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { currentPageMap } from '@/constants/sidebar.constant'

export function useMainLayoutController() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const isAuthenticated = !!session?.user
  const currentPage = currentPageMap[pathname] || '/'

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  const handleSidebarNavigate = useCallback(
    (itemId: string) => {
      const section = document.getElementById(itemId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      } else {
        router.push(itemId === '/' ? '/' : `/${itemId}`)
      }
      setIsSidebarOpen(false)
    },
    [router],
  )

  const handleSettingsClick = useCallback(() => {
    router.push('/settings')
  }, [router])

  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])

  return {
    isAuthenticated,
    user: session?.user,
    isSidebarOpen,
    isSidebarCollapsed,
    currentPage,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapsed,
    handleSidebarNavigate,
    handleSettingsClick,
    handleLogout,
  }
}
