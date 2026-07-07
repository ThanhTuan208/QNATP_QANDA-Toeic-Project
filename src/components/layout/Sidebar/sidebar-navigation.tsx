'use client'

import { usePathname, useRouter } from 'next/navigation'
import { loggedInNavItems } from '@/constants/sidebar.constant'

interface SidebarNavigationProps {
  isExpanded: boolean
  onNavigateItem?: (id: string) => void
}

export default function SidebarNavigation({ isExpanded, onNavigateItem }: SidebarNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleClick = (id: string) => {
    onNavigateItem?.(id)
    router.push(id === 'practice' ? '/practice' : `/${id}`)
  }

  return (
    <nav className='flex-1 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar'>
      {loggedInNavItems.map((item) => {
        const active = pathname.startsWith(`/${item.id}`)
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`w-full flex items-center rounded-xl transition-all duration-300 text-left cursor-pointer ${
              isExpanded ? 'px-4 py-3 gap-4' : 'px-0 py-3 justify-center'
            } ${
              active
                ? 'text-primary bg-leaf font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <item.icon size={22} className='shrink-0' />
            {isExpanded && (
              <span className='text-base font-bold whitespace-nowrap'>{item.label}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
