'use client'

import Link from 'next/link'

export function Navbar() {
  return (
    <nav className='bg-card border-b border-border sticky top-0 z-50'>
      <div className='max-w-5xl mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href='/' className='text-xl font-bold text-primary'>
          TOEIC <span className='font-light text-muted-foreground'>Practice</span>
        </Link>
        <div className='flex space-x-6 text-sm font-medium text-muted-foreground'>
          <Link href='/' className='hover:text-primary transition-colors'>
            Trang chủ
          </Link>
          <Link href='/dashboard' className='hover:text-primary transition-colors'>
            Tiến độ
          </Link>
        </div>
      </div>
    </nav>
  )
}
