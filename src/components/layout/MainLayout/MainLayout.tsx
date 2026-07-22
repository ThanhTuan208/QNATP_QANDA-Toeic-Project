'use client'

import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useSidebarContext } from '@/contexts/SidebarContext'
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
  const { isHidden: isSidebarHidden } = useSidebarContext()

  return (
    <div className='min-h-screen w-full bg-background flex flex-col'>
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
          isHidden={isSidebarHidden}
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
          className={`flex-1 py-6 md:px-18 transition-[margin-left] duration-300 flex justify-center items-center
            ${isSidebarHidden ? 'lg:ml-0' : isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
        >
          <div className='w-full max-w-6xl'>{children}</div>
        </main>
      )}
    </div>
  )
}
