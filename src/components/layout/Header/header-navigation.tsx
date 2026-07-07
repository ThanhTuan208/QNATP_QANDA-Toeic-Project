'use client'

import Link from 'next/link'
import { navItems } from '@/constants/header.constant'

export default function HeaderNavigation() {
  return (
    <nav className='hidden lg:flex items-center justify-center flex-1 gap-12'>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
