'use client'

import HeaderActions from './header-actions'
import HeaderBrand from './header-brand'
import HeaderNavigation from './header-navigation'

interface HeaderProps {
  isLoggedIn?: boolean
  showNav?: boolean
  onNavigateLanding?: () => void
  onNavigateLogin?: () => void
  onNavigateRegister?: () => void
  onToggleSidebar?: () => void
  onProfileClick?: () => void
}

export default function Header({
  isLoggedIn,
  showNav = false,
  onNavigateLanding,
  onNavigateLogin,
  onNavigateRegister,
  onToggleSidebar,
  onProfileClick,
}: HeaderProps) {
  return (
    <header className='h-16 w-full border-b border-border sticky top-0 z-40 bg-card backdrop-blur-md flex justify-between items-center px-4 lg:px-8 shadow-sm transition-all duration-300'>
      <HeaderBrand onToggleSidebar={onToggleSidebar} onNavigateHome={onNavigateLanding} />

      {showNav && <HeaderNavigation />}

      <div className='flex items-center gap-2 md:gap-5 flex-1 lg:flex-none justify-end'>
        <HeaderActions
          isLoggedIn={isLoggedIn}
          onNavigateLogin={onNavigateLogin}
          onNavigateRegister={onNavigateRegister}
          onProfileClick={onProfileClick}
        />
      </div>
    </header>
  )
}
