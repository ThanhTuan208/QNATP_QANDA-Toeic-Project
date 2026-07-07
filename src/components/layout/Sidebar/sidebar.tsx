'use client'

import SidebarActions from './sidebar-actions'
import SidebarBrand from './sidebar-brand'
import SidebarNavigation from './sidebar-navigation'
import SidebarOverlay from './sidebar-overlay'

interface SidebarProps {
  isOpen: boolean
  isCollapsed?: boolean
  isLoggedIn?: boolean
  onClose: () => void
  onToggleCollapse?: () => void
  onNavigateItem?: (id: string) => void
  onBrandClick?: () => void
  onSettingsClick?: () => void
  onLogout?: () => void
}

export default function Sidebar({
  isOpen,
  isCollapsed = false,
  isLoggedIn = true,
  onClose,
  onNavigateItem,
  onSettingsClick,
  onLogout,
}: SidebarProps) {
  const isExpanded = isOpen || !isCollapsed

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClose={onClose} />

      <aside
        className={`h-screen border-r border-border lg:sticky lg:top-0 fixed left-0 top-0 shadow-[2px_0_12px_-4px_rgba(0,0,0,0.5)] flex flex-col p-4 z-50 transition-all duration-300 ease-in-out transform lg:translate-x-0 w-64 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-20' : ''}
          bg-sidebar text-sidebar-foreground`}
      >
        <SidebarBrand isExpanded={isExpanded} onClose={onClose} />

        <SidebarNavigation isExpanded={isExpanded} onNavigateItem={onNavigateItem} />

        <SidebarActions
          isExpanded={isExpanded}
          isLoggedIn={isLoggedIn}
          onSettingsClick={onSettingsClick}
          onLogout={onLogout}
        />
      </aside>
    </>
  )
}
