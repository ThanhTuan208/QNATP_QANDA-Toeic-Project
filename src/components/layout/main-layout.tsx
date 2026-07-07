'use client'

import Header from '@/components/layout/Header/header'
import Sidebar from '@/components/layout/Sidebar/sidebar'
import { useMainLayoutController } from '@/hooks/useMainLayoutController'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isSidebarOpen, toggleSidebar, closeSidebar, handleLogout } =
    useMainLayoutController()

  return (
    <div className='lg:flex min-h-screen w-full bg-background'>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isLoggedIn={isAuthenticated}
        onNavigateItem={closeSidebar}
        onLogout={handleLogout}
      />
      <div className='flex-1 min-w-0 flex flex-col'>
        <Header
          isLoggedIn={isAuthenticated}
          onToggleSidebar={toggleSidebar}
          onNavigateLanding={() => (window.location.href = '/')}
        />
        <main className='flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full'>{children}</main>
      </div>
    </div>
  )
}
