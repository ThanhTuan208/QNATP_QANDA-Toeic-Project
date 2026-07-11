'use client'

import { motion } from 'framer-motion'
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { TYPE_SLUG_MAP_ENG } from '@/constants/index.constants'
import type { PracticeContext } from '@/types/sidebar'

interface SidebarBrandProps {
  isExpanded: boolean
  currentPracticeContext: PracticeContext | null
  onToggleCollapse?: () => void
  onClose?: () => void
}

export default function SidebarBrand({
  isExpanded,
  currentPracticeContext,
  onToggleCollapse,
  onClose,
}: SidebarBrandProps) {
  const { topics, module, expandedFeature, expandedModule, expandedTopic } =
    currentPracticeContext ?? {
      topics: [],
      expandedFeature: null,
      expandedModule: null,
      expandedTopic: null,
    }
  const expandedTopicFind = topics.find((t) => t.slug === expandedTopic)
  const displayTopic = expandedTopicFind ?? null
  const IconComp = displayTopic?.icon ?? module?.icon ?? BookOpen
  const title = TYPE_SLUG_MAP_ENG[expandedTopic ?? 'TOEIC']

  return (
    <div className='relative mb-5'>
      <div className={`flex items-center ${isExpanded ? 'gap-2.5 px-1' : 'justify-center'}`}>
        <Button variant='link' onClick={onClose} className='p-0 hover:no-underline shrink-0'>
          <div className='p-2.5 bg-linear-to-br from-primary to-primary/80 rounded-2xl text-primary-foreground shadow-sm flex items-center justify-center'>
            <IconComp size={20} />
          </div>
        </Button>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='overflow-hidden min-w-0 flex-1'
          >
            <div className='text-sm font-bold truncate leading-tight'>{title}</div>
            <div className='text-[12px] text-muted-foreground/90 mt-0.5'>
              <span>
                {expandedFeature} - {expandedModule}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <Button
        onClick={onToggleCollapse || onClose}
        className='absolute -right-7 top-1/2 -translate-y-1/2 size-8 rounded-lg border border-sidebar-border bg-green-teal-40 hover:bg-green-teal-20 text-muted-foreground/90 hover:text-sidebar-accent-foreground hover:border-primary/40 shadow-sm hover:shadow-md items-center justify-center transition-all duration-200 hidden lg:flex hover:scale-105 active:scale-95'
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </Button>
    </div>
  )
}
