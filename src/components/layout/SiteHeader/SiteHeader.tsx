'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { DropdownNavItem } from '@/components/layout/SiteHeader/DropdownNavItem'
import { MobileNav } from '@/components/layout/SiteHeader/MobileNav'
import { navItems as defaultNavItems } from '@/constants/header.constants'
import type { NavItem } from '@/types/header'
import { useScrollDetection } from '@/hooks/useScrollDetection'

interface SiteHeaderProps {
  isMobileNavOpen?: boolean
  navItems?: NavItem[]
  actions?: React.ReactNode
  onMobileNavToggle?: () => void
  onMobileNavClose?: () => void
}

export function SiteHeader({
  isMobileNavOpen = false,
  navItems = defaultNavItems,
  actions,
  onMobileNavToggle,
  onMobileNavClose,
}: SiteHeaderProps) {
  const scrolled = useScrollDetection()

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-border transition-all duration-300
        ${scrolled ? 'h-16 shadow-sm' : 'h-18'}`}
    >
      <div className='max-w-7xl mx-auto h-full px-4 sm:px-8 lg:px-12 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            buttonType='none'
            onClick={onMobileNavToggle}
            className='lg:hidden p-2 -ml-2 rounded-md hover:bg-accent transition-colors cursor-pointer'
            aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <Link href='/' className='text-2xl font-semibold text-primary tracking-tight shrink-0'>
            <span className='text-neutral-100'>LI</span>TOEIC
          </Link>
        </div>

        <div className='hidden lg:flex items-center justify-center gap-x-2 flex-1 mx-4'>
          {navItems.map((item) => (
            <DropdownNavItem key={item.label} item={item} />
          ))}
        </div>

        <div className='flex items-center justify-end shrink-0'>{actions}</div>
      </div>

      <MobileNav
        isOpen={isMobileNavOpen}
        navItems={navItems}
        onClose={onMobileNavClose ?? (() => {})}
      />
    </nav>
  )
}
