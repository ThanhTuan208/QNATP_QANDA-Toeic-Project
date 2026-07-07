'use client'

import { Button } from '@/components/common/Button'

interface HeaderActionsProps {
  isLoggedIn?: boolean
  onNavigateLogin?: () => void
  onNavigateRegister?: () => void
  onProfileClick?: () => void
}

export default function HeaderActions({
  isLoggedIn,
  onNavigateLogin,
  onNavigateRegister,
  onProfileClick,
}: HeaderActionsProps) {
  if (!isLoggedIn) {
    return (
      <div className='flex items-center gap-2 sm:gap-4'>
        <Button
          onClick={onNavigateLogin}
          className='px-4 py-2 text-xs sm:text-sm border rounded-xl font-bold text-foreground hover:bg-muted transition-colors'
        >
          Đăng nhập
        </Button>
        <Button
          onClick={onNavigateRegister}
          className='px-5 py-2 text-xs sm:text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all'
        >
          Đăng ký
        </Button>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2 md:gap-5'>
      <Button
        onClick={onProfileClick}
        className='w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-primary/20 shrink-0 hover:border-primary transition-all'
      />
    </div>
  )
}
