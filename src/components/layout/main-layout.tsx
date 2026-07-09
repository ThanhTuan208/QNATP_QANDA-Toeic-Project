'use client'

import Sidebar from '@/components/layout/Sidebar/sidebar'
import { SiteHeader } from '@/components/layout/SiteHeader/site-header'
import { useMainLayoutController } from '@/hooks/useMainLayoutController'
import { Button } from '../common/Button'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    isSidebarOpen,
    isSidebarCollapsed,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapsed,
    handleSidebarNavigate,
    handleSettingsClick,
    handleLogout,
  } = useMainLayoutController()

  return (
    <div className='min-h-screen w-full bg-background'>
      <SiteHeader
        showSidebarToggle
        onToggleSidebar={toggleSidebar}
        actions={
          <div className='flex items-center gap-4'>
            <Button
              buttonType='none'
              onClick={handleLogout}
              className='px-4 py-2 text-xs sm:text-sm font-bold text-foreground border border-border rounded-md hover:bg-accent active:scale-95 transition-all'
            >
              Đăng xuất
            </Button>
          </div>
        }
      />

      <Sidebar 
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        isLoggedIn={isAuthenticated}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapsed}
        onNavigateItem={handleSidebarNavigate}
        onSettingsClick={handleSettingsClick}
        onLogout={handleLogout}
      />

      <main
        className={`pt-20 p-4 md:px-18 mt-10 min-h-screen transition-all duration-300 flex justify-center 
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
      >
        <div className='w-full max-w-6xl'>
          {children}
        </div>
      </main>
    </div>
  )
}
