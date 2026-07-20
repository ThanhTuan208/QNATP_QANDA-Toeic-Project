'use client'

import { BookOpen } from 'lucide-react'
import type { QuestionCardOption } from '@/features/quiz/types/question-card'
import { cn } from '@/lib/utils'

interface RationalePanelProps {
  viewingOption: QuestionCardOption | null
  selectedOptionId: string | null
  correctOptionId: string | null
}

export function RationalePanel({
  viewingOption,
  selectedOptionId,
  correctOptionId,
}: RationalePanelProps) {
  if (!viewingOption) {
    return (
      <div className='rounded-xl border-2 border-dashed border-input p-3 sm:p-4 flex items-center justify-center h-full min-h-25 text-xs sm:text-sm text-muted-foreground'>
        Chọn một đáp án để xem giải thích
      </div>
    )
  }

  const isCorrect = viewingOption.id === correctOptionId
  const isWrong = viewingOption.id === selectedOptionId && !isCorrect

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-3 sm:p-4 space-y-2 sm:space-y-3 h-full min-h-25',
        isCorrect
          ? 'border-green-teal bg-green-teal-5'
          : isWrong
            ? 'border-error bg-error-soft/15'
            : 'border-steel-blue bg-steel-blue-5',
      )}
    >
      <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
        <BookOpen className='h-3.5 w-3.5' />
        Giải thích
      </div>
      <p className='text-xs sm:text-sm font-bold leading-5'>
        {viewingOption.text}
      </p>
      {viewingOption.rationale ? (
        <p
          className={cn(
            'text-xs sm:text-sm leading-5',
            isCorrect
              ? 'text-green-dark'
              : isWrong
                ? 'text-error'
                : 'text-steel-blue',
          )}
        >
          {viewingOption.rationale}
        </p>
      ) : (
        <p className='text-xs sm:text-sm leading-5 text-muted-foreground italic'>
          Không có giải thích cho đáp án này
        </p>
      )}
    </div>
  )
}
