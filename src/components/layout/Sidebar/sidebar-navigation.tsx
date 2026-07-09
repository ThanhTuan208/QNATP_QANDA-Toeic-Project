'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { grammarTopic } from '@/constants/sidebar.constant'

interface SidebarNavigationProps {
  isExpanded: boolean
  onNavigateItem?: (id: string) => void
}

export default function SidebarNavigation({
  isExpanded,
  onNavigateItem,
}: SidebarNavigationProps) {
  const pathname = usePathname()

  const isActive = (id: string) => {
    return pathname.startsWith(`/${id}`) || (id === '/' && pathname === '/')
  }

  return (
    <nav className='flex-1 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar'>
      {grammarTopic.map((item) => {
        const active = isActive(item.id)
        return (
          <motion.button
            type='button'
            key={item.id}
            onClick={() => onNavigateItem?.(item.id)}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center rounded-xl transition-all duration-300 text-left cursor-pointer ${isExpanded ? 'px-4 py-3 gap-4' : 'px-0 py-3 justify-center'
              } ${active
                ? 'text-primary bg-leaf font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
          >
            <item.icon
              size={22}
              className={`shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`}
            />
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className='text-base font-bold whitespace-nowrap'
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
