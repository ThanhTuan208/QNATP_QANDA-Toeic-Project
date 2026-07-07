'use client'

import { BookOpen } from 'lucide-react'
import { Button } from '@/components/common/Button'

interface SidebarBrandProps {
  isExpanded: boolean
  onClose?: () => void
}

export default function SidebarBrand({ isExpanded, onClose }: SidebarBrandProps) {
  return (
    <div className={`mb-8 mt-2 flex items-center gap-2 ${isExpanded ? 'px-2' : 'justify-center'}`}>
      <Button variant='link' onClick={onClose} className='p-0 hover:no-underline'>
        <div className='p-2 bg-primary rounded-xl text-primary-foreground shrink-0'>
          <BookOpen size={20} />
        </div>
      </Button>
      {isExpanded && (
        <div className='overflow-hidden flex flex-col'>
          <div className='text-lg font-bold whitespace-nowrap leading-none'>
            <span className='text-primary'>TOEIC</span>
            <span className='text-muted-foreground font-light'>Practice</span>
          </div>
          <div className='text-[8px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap'>
            Reading Part 5 & 6
          </div>
        </div>
      )}
    </div>
  )
}
