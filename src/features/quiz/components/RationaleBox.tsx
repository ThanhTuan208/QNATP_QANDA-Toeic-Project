'use client'

import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
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
          'rounded-xl border-2 p-4 sm:p-5',
          isCorrect ? 'border-green-teal-20 bg-green-teal-5' : 'border-error/20 bg-error-soft',
        )}
      >
        <div className='mb-2.5 sm:mb-3 flex items-center gap-2'>
          {isCorrect ? (
            <>
              <CheckCircle2 className='h-5 sm:h-6 w-5 sm:w-6 text-green-teal' />
              <span className='text-base sm:text-lg font-semibold text-green-dark'>Correct!</span>
            </>
          ) : (
            <>
              <XCircle className='h-5 sm:h-6 w-5 sm:w-6 text-error' />
              <span className='text-base sm:text-lg font-semibold text-error'>Incorrect</span>
            </>
          )}
        </div>
        <p
          className={cn(
            'text-xs sm:text-sm leading-5 sm:leading-6',
            isCorrect ? 'text-green-dark' : 'text-error',
          )}
        >
          {rationale}
        </p>
      </div>

      {hasNext && (
        <button
          type='button'
          onClick={onNext}
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-90 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-neutral-0 transition-colors hover:bg-neutral-80'
        >
          Next Question
          <ArrowRight className='h-3.5 sm:h-4 w-3.5 sm:w-4' />
        </button>
      )}
    </div>
  )
}
