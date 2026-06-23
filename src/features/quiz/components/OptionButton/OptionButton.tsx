'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OptionStatus } from '../../types'

interface OptionButtonProps {
  text: string
  label: string
  status: OptionStatus
  onSelect: () => void
}

const STATUS_STYLES: Record<OptionStatus, string> = {
  idle: 'border-border bg-card hover:border-green-teal hover:bg-green-teal-5',
  selected: 'border-green-teal bg-green-teal-5',
  correct: 'border-green-teal bg-green-teal-5',
  wrong: 'border-error bg-error-soft',
  disabled: 'border-input bg-muted opacity-60 cursor-not-allowed',
}

export function OptionButton({ text, label, status, onSelect }: OptionButtonProps) {
  return (
    <button
      type='button'
      onClick={status === 'disabled' ? undefined : onSelect}
      disabled={status === 'disabled'}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200',
        STATUS_STYLES[status],
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
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
          'pt-1.5 text-sm leading-5',
          status === 'correct' && 'text-green-dark',
          status === 'wrong' && 'text-error',
          status === 'disabled' && 'text-neutral-40',
        )}
      >
        {text}
      </span>

      {status === 'correct' && (
        <CheckCircle2 className='absolute right-3 top-3 h-5 w-5 text-green-teal' />
      )}
      {status === 'wrong' && <XCircle className='absolute right-3 top-3 h-5 w-5 text-error' />}
    </button>
  )
}
