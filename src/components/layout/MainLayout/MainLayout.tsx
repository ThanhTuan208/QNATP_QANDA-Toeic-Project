'use client'

import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useMainLayoutController } from '@/hooks/useMainLayoutController'
import { Button } from '../../common/Button'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    isLandingRoute,
    isSidebarOpen,
    isSidebarCollapsed,
    isMobileNavOpen,
    currentPracticeContext,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapsed,
    handleMobileNavToggle,
    handleMobileNavClose,
    handleTopicClick,
    handleSectionClick,
    handleSettingsClick,
    handleLogout,
  } = useMainLayoutController()

  return (
    <div className='min-h-screen w-full bg-background'>
      <SiteHeader
        isMobileNavOpen={isMobileNavOpen}
        onMobileNavToggle={handleMobileNavToggle}
        onMobileNavClose={handleMobileNavClose}
        actions={
          isLandingRoute ? (
            <div className='flex items-center gap-4'>
              <Link
                href='/login'
                className='px-5 py-2.5 text-xs sm:text-sm font-bold text-foreground border border-border rounded-md hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all'
              >
                Đăng nhập
              </Link>
              <Link
                href='/register'
                className='px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground bg-primary rounded-md hover:opacity-90 active:scale-95 transition-all'
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <Button
              buttonType='none'
              onClick={handleLogout}
              className='px-3 py-1.5 text-xs sm:text-sm font-bold text-foreground border border-border rounded-md hover:bg-accent active:scale-95 transition-all'
            >
              Đăng xuất
            </Button>
          )
        }
      />

      {!isLandingRoute && (
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          isLoggedIn={isAuthenticated}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
          onToggleCollapse={toggleSidebarCollapsed}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
          currentPracticeContext={currentPracticeContext}
          onTopicClick={handleTopicClick}
          onSectionClick={handleSectionClick}
        />
      )}

      {isLandingRoute ? (
        children
      ) : (
        <main
          className={`p-4 md:px-18 mt-2 min-h-screen transition-all duration-300 flex justify-center
            ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
        >
          <div className='w-full max-w-6xl'>{children}</div>
        </main>
      )}
    </div>
  )
}
