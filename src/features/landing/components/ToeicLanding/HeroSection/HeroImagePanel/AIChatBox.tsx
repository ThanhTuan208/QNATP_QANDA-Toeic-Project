'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { QUIZ_DATA } from '@/features/landing/constants'
import type { TimelineStep } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/quizTimeline'

interface AIChatBoxProps {
  step: TimelineStep
}

export function AIChatBox({ step }: AIChatBoxProps) {
  return (
    <div className='mt-4 h-20 md:mt-5 md:h-24'>
      <AnimatePresence mode='wait'>
        {step === 3 && (
          <motion.div
            key='loading'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='flex h-full items-center justify-center gap-2.5 rounded-2xl bg-primary/5 font-mono text-[13px] text-primary ring-1 ring-primary/10'
          >
            <Loader2 className='h-4 w-4 animate-spin' /> Analyzing context...
          </motion.div>
        )}
        {step >= 4 && (
          <motion.div
            key='explanation'
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className='relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-4 ring-1 ring-primary/20'
          >
            <Sparkles className='absolute right-3 top-3 h-10 w-10 text-primary/15' />
            <div className='mb-1.5 flex items-center gap-1.5 text-success'>
              <CheckCircle2 className='h-4 w-4' />
              <span className='text-[11px] font-bold uppercase tracking-widest'>Chính xác</span>
            </div>
            <p className='text-[12.5px] leading-snug text-muted-foreground'>
              {QUIZ_DATA.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
