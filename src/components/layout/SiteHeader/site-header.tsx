'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button/button'
import { DropdownNavItem } from '@/components/layout/SiteHeader/dropdown-nav-item'
import { navItems as defaultNavItems, type NavItem } from '@/constants/header.constant'

interface SiteHeaderProps {
  showSidebarToggle?: boolean
  onToggleSidebar?: () => void
  navItems?: NavItem[]
  actions?: React.ReactNode
}

export function SiteHeader({
  showSidebarToggle,
  onToggleSidebar,
  navItems = defaultNavItems,
  actions,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-border transition-all duration-300 ${
        scrolled ? 'h-16 shadow-sm' : 'h-20'
      }`}
    >
      <div className='max-w-7xl mx-auto px-12 flex justify-between items-center h-full'>
        <div className='flex items-center gap-3'>
          {showSidebarToggle && (
            <Button
              onClick={onToggleSidebar}
              className='p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors'
              aria-label='Toggle sidebar'
            >
              <Menu size={20} />
            </Button>
          )}
          <Link href='/' className='text-2xl font-bold text-primary tracking-tight'>
            TOEIC Mastery
          </Link>
        </div>

        <div className='hidden lg:flex items-center gap-x-2'>
          {navItems.map((item) => (
            <DropdownNavItem key={item.label} item={item} />
          ))}
        </div>

        <div className='flex items-center gap-4'>{actions}</div>
      </div>
    </nav>
  )
}
