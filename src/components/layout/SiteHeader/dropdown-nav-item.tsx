import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/common/Button'
import type { NavItem } from '@/constants/header.constant'

export function DropdownNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const countDropItems = item.dropdownItems?.length ?? 0
  const dropdownWidth = countDropItems > 3 ? 'w-[460px]' : 'w-52'
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!item.dropdownItems) {
    return (
      <Link
        href={item.href ?? '#'}
        className='text-sm font-semibold text-foreground hover:text-primary transition-colors'
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div
      role='none'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='relative inline-block text-left'
    >
      <Button
        buttonType='none'
        className='flex items-center gap-x-1 text-sm font-semibold text-foreground hover:text-primary transition-colors'
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Button>

      <div
        className={`absolute left-1/2 z-10 mt-3 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all duration-200 ${dropdownWidth}
                    ${open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-4 opacity-0'}`}
      >
        <div className={`p-3 grid ${countDropItems > 3 ? ' grid-cols-2' : ' grid-cols-1'} gap-1`}>
          {item.dropdownItems.map((child) => {
            const Icon = child.icon
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className='group flex items-center gap-x-4 rounded-xl p-3 text-sm hover:bg-accent transition-colors'
              >
                <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
                  <Icon size={18} />
                </div>
                <div>
                  <p className='font-semibold text-foreground'>{child.label}</p>
                  {child.description && (
                    <p className='text-xs text-muted-foreground'>{child.description}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
