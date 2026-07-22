'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import type { OptionStatus } from '@/features/quiz/types'
import { cn } from '@/lib/utils'

interface OptionButtonProps {
  text: string
  label: string
  status: OptionStatus
  onSelect: () => void
}

export const STATUS_STYLES: Record<OptionStatus, string> = {
  idle: 'border-border bg-card hover:border-green-teal hover:bg-green-teal-5',
  selected: 'border-green-teal bg-green-teal-5',
  correct: 'border-green-teal bg-green-teal-5',
  wrong: 'border-error bg-error-soft/15',
  viewing: 'border-steel-blue bg-steel-blue-5',
  disabled: 'border-input bg-muted opacity-60',
}

export function OptionButton({ text, label, status, onSelect }: OptionButtonProps) {
  return (
    <button
      type='button'
      onClick={onSelect}
      className={cn(
        'group relative flex w-full items-start gap-2 sm:gap-3 rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-200',
        STATUS_STYLES[status],
      )}
    >
      <span
        className={cn(
          'flex h-7 sm:h-8 w-7 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs sm:text-sm font-bold border transition-all duration-200 shadow-sm',
          status === 'idle' && [
            'bg-linear-to-b from-neutral-0 to-neutral-5 dark:from-neutral-80 dark:to-neutral-90 border-neutral-2 dark:border-border text-muted-foreground',
            'group-hover:scale-105 group-hover:border-green-teal/30 group-hover:bg-linear-green group-hover:text-primary dark:group-hover:text-neutral-90',
          ],
          status === 'selected' &&
            'bg-linear-green border-primary text-white dark:text-neutral-90 font-extrabold scale-105 shadow-md shadow-green-teal/20',
          status === 'correct' &&
            'bg-linear-to-br from-green-teal to-pale-light border-success text-white dark:text-neutral-90 font-extrabold scale-105 shadow-md shadow-success/30',
          status === 'wrong' &&
            'bg-linear-to-br from-error-hover to-warning-foreground/80 border-error text-white font-extrabold scale-105 shadow-md shadow-error/30',
          status === 'viewing' &&
            'bg-steel-blue text-white border-steel-blue-20 font-extrabold scale-105 shadow-md shadow-steel-blue/20',
          status === 'disabled' &&
            'bg-neutral-5 dark:bg-muted/40 border-neutral-2/30 dark:border-border/30 text-neutral-40/50 cursor-default shadow-none',
        )}
      >
        {label}
      </span>

      <span
        className={cn(
          'flex-1 pt-1 sm:pt-1.5 text-xs sm:text-sm font-bold leading-4 sm:leading-5',
          status === 'correct' && 'text-green-dark',
          status === 'wrong' && 'text-error',
          status === 'viewing' && 'text-steel-blue',
          status === 'disabled' && 'text-neutral-40',
        )}
      >
        {text}
      </span>

      {status === 'correct' && (
        <CheckCircle2 className='shrink-0 h-4 sm:h-5 w-4 sm:w-5 text-green-teal' />
      )}
      {status === 'wrong' && <XCircle className='shrink-0 h-4 sm:h-5 w-4 sm:w-5 text-error' />}
    </button>
  )
}
