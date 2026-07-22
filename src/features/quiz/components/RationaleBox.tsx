'use client'

import { ArrowRight, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RationaleBoxProps {
  isCorrect: boolean
  rationale: string
  onNext: () => void
  hasNext: boolean
}

export function RationaleBox({ isCorrect, rationale, onNext, hasNext }: RationaleBoxProps) {
  return (
    <div className='space-y-4'>
      <div
        className={cn(
          'rounded-xl border p-4 sm:p-5 flex gap-3 transition-colors',
          isCorrect ? 'border-primary/20 bg-primary/5' : 'border-rose-500/20 bg-rose-500/5',
        )}
      >
        <BookOpen
          className='w-4 h-4 shrink-0 mt-0.5'
          style={{ color: isCorrect ? 'var(--color-option-a)' : 'var(--color-quiz-error)' }}
        />
        <div>
          <p
            className='text-xs font-semibold mb-1'
            style={{ color: isCorrect ? 'var(--color-option-a)' : 'var(--color-quiz-error)' }}
          >
            {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
          </p>
          <p className='text-sm leading-relaxed text-foreground/80 font-medium'>{rationale}</p>
        </div>
      </div>

      {hasNext && (
        <button
          type='button'
          onClick={onNext}
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]'
        >
          Câu tiếp
          <ArrowRight className='h-4 w-4' />
        </button>
      )}
    </div>
  )
}
