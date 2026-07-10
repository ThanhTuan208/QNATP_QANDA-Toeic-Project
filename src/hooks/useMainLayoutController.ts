'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { practiceModules } from '@/constants/sidebar.constant'

export function useMainLayoutController() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const scrollPositions = useRef<Record<string, number>>({})

  const isAuthenticated = !!session?.user

  const isPracticeRoute = pathname.startsWith('/practice')

  const currentPracticeContext = useMemo(() => {
    if (!isPracticeRoute) return null

    const moduleId = (params.module as string | undefined) ?? pathname.split('/')[2]
    const practiceModule = practiceModules.find((m) => m.id === moduleId) ?? null
    const expandedFeature = pathname.split('/')[1] ?? null
    const expandedModule = pathname.split('/')[2] ?? null
    const expandedTopic = pathname.split('/')[3] ?? null

    return {
      module: practiceModule,
      topics: practiceModule?.topics ?? [],
      expandedFeature,
      expandedModule,
      expandedTopic,
    }
  }, [isPracticeRoute, params.module, pathname])

  // save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current[pathname] = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // restore scroll position on route change
  useEffect(() => {
    const saved = scrollPositions.current[pathname]
    if (saved !== undefined) {
      requestAnimationFrame(() => window.scrollTo(0, saved))
    }
  }, [pathname])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  const handleTopicClick = useCallback(
    (topicSlug: string) => {
      const moduleId = (params.module as string | undefined) ?? pathname.split('/')[2]
      if (!moduleId) return
      scrollPositions.current[pathname] = window.scrollY
      router.push(`/practice/${moduleId}/${topicSlug}`)
      setIsSidebarOpen(false)
    },
    [router, params.module, pathname],
  )

  const handleSectionClick = useCallback(
    (topicSlug: string, sectionId: string) => {
      const moduleId = (params.module as string | undefined) ?? pathname.split('/')[2]
      if (!moduleId) return
      scrollPositions.current[pathname] = window.scrollY
      router.push(`/practice/${moduleId}/${topicSlug}#${topicSlug}-${sectionId}`)
      setIsSidebarOpen(false)
    },
    [router, params.module, pathname],
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
    currentPracticeContext,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapsed,
    handleTopicClick,
    handleSectionClick,
    handleSettingsClick,
    handleLogout,
  }
}
