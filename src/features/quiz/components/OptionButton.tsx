'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import type { OptionStatus } from '@/features/quiz/types'
import { cn } from '@/lib/utils'

interface OptionButtonProps {
  text: string
  label: string
  status: OptionStatus
  rationale?: string
  onSelect: () => void
}

const STATUS_STYLES: Record<OptionStatus, string> = {
  idle: 'border-border bg-card hover:border-green-teal hover:bg-green-teal-5',
  selected: 'border-green-teal bg-green-teal-5',
  correct: 'border-green-teal bg-green-teal-5',
  wrong: 'border-error bg-error-soft',
  disabled: 'border-input bg-muted opacity-60 cursor-not-allowed',
}

export function OptionButton({ text, label, status, rationale, onSelect }: OptionButtonProps) {
  const isRevealed = status === 'correct' || status === 'wrong' || status === 'disabled'

  return (
    <button
      type='button'
      onClick={status === 'disabled' ? undefined : onSelect}
      disabled={status === 'disabled'}
      className={cn(
        'group relative flex w-full flex-col items-start gap-1 sm:gap-1.5 rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-200',
        STATUS_STYLES[status],
      )}
    >
      <div className='flex w-full items-start gap-2 sm:gap-3'>
        <span
          className={cn(
            'flex h-7 sm:h-8 w-7 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors',
            status === 'correct' && 'bg-green-teal text-white',
            status === 'wrong' && 'bg-error text-white',
            status === 'selected' && 'bg-green-teal text-white',
            status === 'idle' &&
              'bg-muted text-muted-foreground group-hover:bg-green-teal-10 group-hover:text-green-dark',
            status === 'disabled' && 'bg-muted text-neutral-40',
          )}
        >
          {label}
        </span>

        <span
          className={cn(
            'flex-1 pt-1 sm:pt-1.5 text-xs sm:text-sm leading-4 sm:leading-5',
            status === 'correct' && 'text-green-dark',
            status === 'wrong' && 'text-error',
            status === 'disabled' && 'text-neutral-40',
          )}
        >
          {text}
        </span>

        {status === 'correct' && (
          <CheckCircle2 className='shrink-0 h-4 sm:h-5 w-4 sm:w-5 text-green-teal' />
        )}
        {status === 'wrong' && (
          <XCircle className='shrink-0 h-4 sm:h-5 w-4 sm:w-5 text-error' />
        )}
      </div>

      {isRevealed && rationale && (
        <div
          className={cn(
            'ml-9 sm:ml-11 text-[11px] sm:text-xs leading-relaxed border-l-2 pl-2.5 sm:pl-3 mt-1',
            status === 'correct' && 'border-green-teal/30 text-green-teal/80',
            status === 'wrong' && 'border-error/30 text-error/80',
            status === 'disabled' && 'border-neutral-30/20 text-neutral-40',
          )}
        >
          {rationale}
        </div>
      )}
    </button>
  )
}
