'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import type { TimelineStep } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/quizTimeline'

interface ProgressFooterProps {
  step: TimelineStep
}

export function ProgressFooter({ step }: ProgressFooterProps) {
  return (
    <div className='relative mt-4 border-t border-border pt-4 md:mt-5 md:pt-5'>
      <div className='mb-2.5 flex items-center justify-between'>
        <span className='text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'>
          Progress
        </span>
        <div className='flex items-center gap-2.5'>
          {step >= 5 && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className='flex items-center gap-1 rounded-md bg-safety-orange/10 px-2 py-0.5 text-[10px] font-bold text-safety-orange ring-1 ring-safety-orange/20'
            >
              <Flame className='h-3 w-3' /> 5 Streak
            </motion.span>
          )}
          <span className='font-mono text-[15px] font-bold text-foreground drop-shadow-md'>
            {step >= 5 ? '79%' : '78%'}
          </span>
        </div>
      </div>
      <div className='h-2.5 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border shadow-inner'>
        <motion.div
          className='h-full rounded-full bg-linear-to-r from-primary to-green-teal shadow-[0_0_10px_rgba(0,128,129,0.3)]'
          initial={{ width: '78%' }}
          animate={{ width: step >= 5 ? '79%' : '78%' }}
          transition={{ duration: 1, ease: 'easeOut', type: 'spring' }}
        />
      </div>

      <AnimatePresence>
        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5, x: '-50%' }}
            animate={{ opacity: [0, 1, 0], y: -50, scale: 1, x: '-50%' }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className='absolute -right-2.5 top-0 text-[15px] font-extrabold text-safety-orange drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
          >
            +10 XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
