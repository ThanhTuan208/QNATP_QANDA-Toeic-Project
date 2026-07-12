'use client'

import { motion } from 'framer-motion'
import { MousePointer2 } from 'lucide-react'
import type { TimelineStep } from '@/features/landing/components/ToeicLanding/HeroSection/HeroImagePanel/quizTimeline'
import { QUIZ_DATA } from '@/features/landing/constants'
import { cn } from '@/lib/utils'

interface OptionsListProps {
  step: TimelineStep
}

export function OptionsList({ step }: OptionsListProps) {
  const { options, correctIndex } = QUIZ_DATA

  return (
    <div className='relative grid grid-cols-2 gap-2.5'>
      {options.map((opt, idx) => {
        const isCorrect = step >= 4 && idx === correctIndex
        const isSelected = step >= 2 && idx === correctIndex
        const isHovered = step === 1 && idx === 0

        return (
          <div
            key={opt}
            className={cn(
              'flex items-center gap-3.5 rounded-md p-3.5 transition-all duration-500',
              isCorrect
                ? 'bg-success-soft text-success-foreground ring-1 ring-success/30'
                : isSelected
                  ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                  : isHovered
                    ? 'scale-[1.01] bg-accent text-accent-foreground ring-1 ring-accent-foreground/20'
                    : 'bg-muted/50 text-muted-foreground ring-1 ring-border hover:bg-accent/50',
            )}
          >
            <div
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded-full transition-all duration-300',
                isCorrect
                  ? 'bg-success ring-4 ring-success/20'
                  : isSelected
                    ? 'bg-primary ring-4 ring-primary/20'
                    : isHovered
                      ? 'border-2 border-accent-foreground bg-transparent'
                      : 'border-2 border-border bg-transparent',
              )}
            >
              {(isSelected || isCorrect) && <div className='h-1.5 w-1.5 rounded-full bg-white' />}
            </div>
            <span
              className={cn(
                'text-sm capitalize',
                isSelected || isCorrect || isHovered ? 'font-semibold' : 'font-medium',
              )}
            >
              {opt}
            </span>
          </div>
        )
      })}

      <motion.div
        className='pointer-events-none absolute z-50'
        initial={{ top: '100%', left: '80%', opacity: 0 }}
        animate={
          step === 0
            ? { top: '100%', left: '80%', opacity: 0 }
            : step === 1
              ? { top: ['100%', '5%', '20%'], left: ['20%', '3%', '10%'], opacity: 1 }
              : step === 2
                ? { top: '20%', right: '10%', scale: 0.85, opacity: 1 }
                : { top: '80%', right: '80%', opacity: 0, scale: 1 }
        }
        transition={
          step === 1 ? { duration: 1.5, ease: 'easeInOut', times: [0, 0.5, 1] } : { duration: 0.2 }
        }
      >
        <MousePointer2 className='h-7 w-7 fill-white text-primary' />
      </motion.div>
    </div>
  )
}
