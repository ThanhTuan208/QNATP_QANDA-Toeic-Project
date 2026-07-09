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
      className={`mt-auto space-y-2 pt-6 border-t border-border ${isExpanded ? '' : 'flex flex-col items-center'}`}
    >
      <Button
        onClick={onSettingsClick}
        className={`w-full flex items-center rounded-xl transition-all text-muted-foreground hover:text-foreground hover:bg-muted ${isExpanded ? 'px-4 py-3 gap-4' : 'px-0 py-3 justify-center'}`}
      >
        <Settings size={20} className='shrink-0' />
        {isExpanded && <span className='text-sm font-bold whitespace-nowrap'>Cài đặt</span>}
      </Button>
      <button
        type='button'
        onClick={onLogout}
        className={`w-full flex items-center rounded-xl transition-all text-destructive hover:bg-destructive/10 cursor-pointer ${isExpanded ? 'px-4 py-3 gap-4' : 'px-0 py-3 justify-center'}`}
      >
        <LogOut size={20} className='shrink-0' />
        {isExpanded && <span className='text-sm font-bold whitespace-nowrap'>Đăng xuất</span>}
      </button>
    </div>
  )
}
