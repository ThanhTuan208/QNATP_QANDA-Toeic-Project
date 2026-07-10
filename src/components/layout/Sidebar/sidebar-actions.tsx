'use client'

import { LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/common/Button'

interface SidebarActionsProps {
  isExpanded: boolean
  isLoggedIn?: boolean
  onSettingsClick?: () => void
  onLogout?: () => void
}

export default function SidebarActions({
  isExpanded,
  isLoggedIn,
  onSettingsClick,
  onLogout,
}: SidebarActionsProps) {
  if (!isLoggedIn) return null

  return (
    <div
      className={`pt-4 border-t border-sidebar-border/50 ${isExpanded ? '' : 'flex flex-col items-center'}`}
    >
      <Button
        onClick={onSettingsClick}
        className={`group w-full flex items-center rounded-xl transition-all duration-200 text-muted-foreground/60 hover:text-foreground hover:bg-accent/40 cursor-pointer
          ${isExpanded ? 'px-3 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'}`}
      >
        <Settings
          size={18}
          className='shrink-0 transition-transform duration-200 group-hover:rotate-45'
        />
        {isExpanded && <span className='text-sm font-medium whitespace-nowrap'>Cài đặt</span>}
      </Button>
      <button
        type='button'
        onClick={onLogout}
        className={`group w-full flex items-center rounded-xl transition-all duration-200 text-destructive/60 hover:text-destructive hover:bg-destructive/5 cursor-pointer
          ${isExpanded ? 'px-3 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'}`}
      >
        <LogOut
          size={18}
          className='shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5'
        />
        {isExpanded && <span className='text-sm font-medium whitespace-nowrap'>Đăng xuất</span>}
      </button>
    </div>
  )
}
