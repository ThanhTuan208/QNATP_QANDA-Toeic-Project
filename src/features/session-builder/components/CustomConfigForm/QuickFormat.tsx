'use client'

import { X, Zap } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuickFormat } from '@/features/session-builder/hooks/useQuickFormat'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'
import { QuickFormatContent } from './QuickFormatContent'

interface QuickFormatProps {
  parts: number[]
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  onApply: (groups: KnowledgeGroupConfig[], part: number) => void
  onApplyAll?: (allGroups: Record<number, KnowledgeGroupConfig[]>) => void
  show: boolean
  onClose: () => void
}

export function QuickFormat({ parts, knowledgeGroups, onApply, onApplyAll, show, onClose }: QuickFormatProps) {
  const hook = useQuickFormat({ parts, knowledgeGroups, onApply, onApplyAll })

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ width: 0, opacity: 0, x: 40 }}
          animate={{ width: 380, opacity: 1, x: 0 }}
          exit={{ width: 0, opacity: 0, x: 40 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className='shrink-0 overflow-hidden border-l border-green-teal-10/50 dark:border-neutral-80/20 pl-5'
        >
          <div className='flex flex-col w-88' style={{ height: '640px', maxHeight: '80vh' }}>
            {/* Header */}
            <div className='flex items-center justify-between pb-3 border-b border-green-teal-10 dark:border-neutral-80/20'>
              <div className='flex items-center gap-2'>
                <Zap className='size-4 text-green-teal dark:text-pale-teal fill-green-teal-10 dark:fill-pale-teal/10' />
                <span className='text-sm lg:text-base font-bold text-primary-teal dark:text-pale-light'>Định dạng nhanh</span>
              </div>
              <button
                type='button'
                onClick={onClose}
                className='rounded-full p-1 text-subtext-50 hover:text-foreground hover:bg-green-teal-5 dark:hover:bg-neutral-80/20 transition-colors'
              >
                <X className='size-4' />
              </button>
            </div>

            <QuickFormatContent {...hook} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
