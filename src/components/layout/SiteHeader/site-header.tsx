'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
      className={`fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-border transition-all duration-300 
        ${scrolled ? 'h-16 shadow-sm' : 'h-18'}`}
    >
      <div className='max-w-7xl mx-auto h-full px-12 grid grid-cols-[1fr_auto_1fr] items-center'>
        <div className='flex items-center gap-3'>
          {showSidebarToggle && (
            <button
              type='button'
              onClick={onToggleSidebar}
              className='lg:hidden p-2 -ml-2 rounded-md hover:bg-accent transition-colors'
              aria-label='Toggle sidebar'
            >
              <Menu size={24} />
            </button>
          )}
          <Link href='/' className='text-2xl font-semibold text-primary tracking-tight'>
            <span className='text-neutral-100'>LI</span>TOEIC
          </Link>
        </div>

        <div className='hidden lg:flex justify-center gap-x-2 mr-10'>
          {navItems.map((item) => (
            <DropdownNavItem key={item.label} item={item} />
          ))}
        </div>

        {/* Actions */}
        <div className='flex justify-end items-center'>{actions}</div>
      </div>
    </nav>
  )
}
