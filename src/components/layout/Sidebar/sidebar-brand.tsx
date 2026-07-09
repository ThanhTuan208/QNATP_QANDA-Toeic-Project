'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/common/Button'
import { navItems as headerNavItems } from '@/constants/header.constant'

interface SidebarBrandProps {
  isExpanded: boolean
  onToggleCollapse?: () => void
  onClose?: () => void
}

interface SubItemInfo {
  icon: LucideIcon
  label: string
  description: string
}

function buildSubItemMap(): Map<string, SubItemInfo> {
  const map = new Map<string, SubItemInfo>()
  for (const group of headerNavItems) {
    if (group.dropdownItems) {
      for (const item of group.dropdownItems) {
        map.set(item.href, {
          icon: item.icon,
          label: item.label,
          description: item.description ?? '',
        })
      }
    }
  }
  return map
}

const subItemMap = buildSubItemMap()

function getActiveSubItem(pathname: string): SubItemInfo | null {
  for (const [href, info] of subItemMap) {
    if (pathname.startsWith(href)) {
      return info
    }
  }
  return null
}

export default function SidebarBrand({ isExpanded, onToggleCollapse, onClose }: SidebarBrandProps) {
  const pathname = usePathname()
  const activeSubItem = getActiveSubItem(pathname)

  return (
    <div className='relative mb-8 mt-2'>
      <div className={`flex items-center gap-2 ${isExpanded ? 'px-2' : 'justify-center'}`}>
        <Button variant='link' onClick={onClose} className='p-0 hover:no-underline'>
          <div
            className={`p-2 rounded-xl text-primary-foreground shrink-0 flex items-center justify-center ${
              activeSubItem ? 'bg-safety-orange' : 'bg-primary'
            }`}
          >
            {activeSubItem ? (
              <activeSubItem.icon size={20} />
            ) : (
              <ChevronLeft size={20} className='rotate-90' />
            )}
          </div>
        </Button>
        {isExpanded && (
          <div className='overflow-hidden flex flex-col'>
            {activeSubItem ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className='text-lg font-bold whitespace-nowrap leading-none'>
                  {activeSubItem.label}
                </div>
                <div className='text-[10px] text-muted-foreground/70 whitespace-nowrap'>
                  {activeSubItem.description}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className='text-lg font-bold whitespace-nowrap leading-none'>
                  <span className='text-primary'>TOEIC</span>
                  <span className='text-muted-foreground font-light'>Practice</span>
                </div>
                <div className='text-[8px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap'>
                  Reading Part 5 & 6
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={onToggleCollapse || onClose}
        className='absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary shadow-md flex items-center justify-center transition-all hidden lg:flex'
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </Button>
    </div>
  )
}
