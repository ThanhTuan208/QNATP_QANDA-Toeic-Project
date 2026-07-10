'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/common/Button'
import type { PracticeContext } from '@/constants/sidebar.constant'
import { FirstCharOfStringCapitalize } from '@/utils/sidebar.util'

interface SidebarNavigationProps {
  isExpanded: boolean
  currentPracticeContext: PracticeContext | null
  onTopicClick: (topicSlug: string) => void
  onSectionClick: (topicSlug: string, sectionId: string) => void
}

export default function SidebarNavigation({
  isExpanded,
  currentPracticeContext,
  onTopicClick,
  onSectionClick,
}: SidebarNavigationProps) {
  const router = useRouter()

  const prefetchTopic = useCallback(
    (slug: string) => {
      if (!currentPracticeContext?.module) return
      router.prefetch(`/practice/${currentPracticeContext.module.id}/${slug}`)
    },
    [router, currentPracticeContext],
  )

  const { topics, expandedTopic } = currentPracticeContext ?? { topics: [], expandedTopic: null }

  return (
    <nav className='h-full overflow-y-auto overflow-x-hidden no-scrollbar'>
      <AnimatePresence mode='wait'>
        {currentPracticeContext && (
          <motion.div
            key={currentPracticeContext.module?.id ?? 'practice'}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className='space-y-0.5 px-1'>
              {topics.map((topic) => {
          const isOpen = expandedTopic === topic.slug
          const IconComp = topic.icon

          return (
            <div key={topic.slug}>
              <Button
                buttonType='none'
                onClick={() => onTopicClick(topic.slug)}
                onMouseEnter={() => prefetchTopic(topic.slug)}
                className={`group relative w-full flex items-center rounded-md transition-all duration-200 text-left cursor-pointer overflow-hidden
                  ${isExpanded ? 'px-3 py-5 gap-3' : 'px-0 py-2.5 justify-center'}
                  ${
                      isOpen
                        ? 'text-sidebar-accent-foreground bg-sidebar-accent font-semibold shadow-sm border border-primary/80'
                        : 'text-muted-foreground/70 hover:text-foreground hover:bg-accent/40 border border-transparent'
                  }`}
              >
                {isOpen && (
                  <span className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-full bg-primary' />
                )}
                <div
                  className={`shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110
                  ${isOpen ? 'text-primary' : ''}`}
                >
                  <IconComp size={20} />
                </div>
                {isExpanded && (
                  <span className='flex-1 text-sm whitespace-nowrap'>{topic.label}</span>
                )}
                {isExpanded && (
                  <motion.span
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className='shrink-0'
                  >
                    <ChevronDown
                      size={14}
                      className='opacity-40 group-hover:opacity-70 transition-opacity'
                    />
                  </motion.span>
                )}
              </Button>

              {isOpen && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                  className='overflow-hidden'
                >
                  <div className='relative ml-7 mt-0.5 space-y-0.5 pl-4 border-l-2 border-sidebar-border/60'>
                    <div className='absolute left-0 top-0 -translate-x-1/2 size-2 rounded-full bg-sidebar-border/60' />
                    {topic.sections.map((section, idx) => (
                      <motion.div
                        key={section.id}
                        initial={{ x: -8, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.25, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <button
                          type='button'
                          onClick={() => onSectionClick(topic.slug, section.id)}
                          className='w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground/60 hover:text-foreground hover:bg-accent/50 transition-all duration-200 cursor-pointer'
                        >
                          <div className='flex items-center gap-1.5'>
                            <div className='size-1.5 rounded-full bg-primary/40' />
                            {FirstCharOfStringCapitalize(section.id)}
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )
        })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
