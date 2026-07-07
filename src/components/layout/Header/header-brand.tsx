'use client'

import { BookOpen, Menu } from 'lucide-react'
import { Button } from '@/components/common/Button'

interface HeaderBrandProps {
  onToggleSidebar?: () => void
  onNavigateHome?: () => void
}

export default function HeaderBrand({ onToggleSidebar, onNavigateHome }: HeaderBrandProps) {
  return (
    <div className='flex items-center gap-3'>
      <Button
        variant='link'
        onClick={onToggleSidebar}
        className='lg:hidden p-2 text-muted-foreground hover:text-foreground'
      >
        <Menu size={20} />
      </Button>

      <Button
        variant='link'
        onClick={onNavigateHome}
        className='hidden lg:flex items-center gap-2 hover:no-underline'
      >
        <div className='p-1.5 bg-primary rounded-lg text-primary-foreground'>
          <BookOpen size={16} />
        </div>
        <span className='text-xl font-bold whitespace-nowrap'>
          <span className='text-primary'>TOEIC</span>
          <span className='text-muted-foreground font-light'>Practice</span>
        </span>
      </Button>
    </div>
  )
}
