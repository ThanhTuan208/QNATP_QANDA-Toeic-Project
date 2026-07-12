'use client'

import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AIChatBox } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/AIChatBox'
import { OptionsList } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/OptionsList'
import { ProgressFooter } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/ProgressFooter'
import type { TimelineStep } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/quizTimeline'
import { TIMELINE } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/quizTimeline'
import { QUIZ_DATA } from '@/features/landing/constants'
import { cn } from '@/lib/utils'

export function HeroImagePanel() {
  const [step, setStep] = useState<TimelineStep>(0)

  useEffect(() => {
    const entry = TIMELINE.find((t) => t.step === step)
    if (!entry) {
      setStep(0 as TimelineStep)
      return
    }
    const next = (step + 1) as TimelineStep
    const timer = setTimeout(() => setStep(next), entry.duration)
    return () => clearTimeout(timer)
  }, [step])

  return (
    <motion.div
      className='relative mx-auto flex w-full max-w-md items-center justify-center p-4 md:max-w-lg lg:max-w-115 lg:p-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className='absolute left-1/4 top-1/4 h-62.5 w-62.5 animate-pulse rounded-full bg-primary/15 blur-[90px]' />
      <div className='absolute bottom-1/4 right-1/4 h-50 w-50 animate-pulse rounded-full bg-green-teal/20 blur-[80px] delay-700' />

      <motion.div className='relative w-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lg ring-1 ring-black/5 sm:rounded-[2rem] sm:p-7'>
        <div className='absolute left-1/2 top-0 h-px w-150 -translate-x-1/2 bg-linear-to-r from-transparent via-primary/30 to-transparent' />

        <motion.div animate={{ opacity: step === 6 ? 0 : 1 }} transition={{ duration: 0.4 }}>
          <div className='flex items-center justify-between pb-5'>
            <div className='flex items-center gap-2'>
              <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/30'>
                <Target className='h-3.5 w-3.5' />
              </div>
              <span className='bg-linear-to-r from-primary to-green-teal bg-clip-text font-mono text-[13px] font-bold tracking-wider text-transparent'>
                {QUIZ_DATA.label}
              </span>
            </div>
            <span className='rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground ring-1 ring-border'>
              {QUIZ_DATA.questionNumber}
            </span>
          </div>

          <div className='mb-6 text-[15px] font-medium leading-loose text-foreground'>
            {QUIZ_DATA.prefix}{' '}
            <span
              className={cn(
                'relative mx-1 inline-flex min-w-20 items-center justify-center rounded-md px-2 py-0.5 transition-all duration-300',
                step >= 2
                  ? 'bg-primary/10 font-bold text-primary ring-1 ring-primary/30'
                  : 'border-b border-dashed border-border bg-muted text-transparent',
              )}
            >
              {step >= 2 ? QUIZ_DATA.answer : QUIZ_DATA.placeholder}
            </span>{' '}
            {QUIZ_DATA.suffix}
          </div>

          <OptionsList step={step} />
          <AIChatBox step={step} />
          <ProgressFooter step={step} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
