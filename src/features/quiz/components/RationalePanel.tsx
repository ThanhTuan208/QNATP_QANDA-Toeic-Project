'use client'

import { BookOpen } from 'lucide-react'
import { usePracticeOptions } from '@/contexts/PracticeOptionsContext'
import type { QuestionCardOption } from '@/features/quiz/types/question-card'
import { cn } from '@/lib/utils'

interface RationalePanelProps {
  setHeight?: string | null
  viewingOption: QuestionCardOption | null
  selectedOptionId: string | null
  correctOptionId: string | null
}

export function RationalePanel({
  setHeight,
  viewingOption,
  selectedOptionId,
  correctOptionId,
}: RationalePanelProps) {
  const { showExplanations } = usePracticeOptions()

  const isCorrect = viewingOption?.id === correctOptionId
  const isWrong = viewingOption?.id === selectedOptionId && !isCorrect

  return (
    <div
      className={cn(
        `rounded-xl border-2 p-3 sm:p-4 flex flex-col transition-all duration-300 ${setHeight === 'part_7' ? "h-30" : "h-full"}`,
        !showExplanations
          ? 'border-dashed border-input'
          : viewingOption
            ? isCorrect
              ? 'border-green-teal bg-green-teal-5'
              : isWrong
                ? 'border-error bg-error-soft/15'
                : 'border-steel-blue bg-steel-blue-5'
            : 'border-dashed border-input',
      )}
    >
      <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0'>
        <BookOpen className='h-3.5 w-3.5' />
        Giải thích
      </div>

      {!showExplanations ? (
        <p className='text-xs text-muted-foreground italic m-auto text-center'>
          Tính năng giải thích đã tắt
        </p>
      ) : viewingOption ? (
        <div className='space-y-2 overflow-y-auto mt-2'>
          <p className='text-xs sm:text-sm font-bold leading-5'>{viewingOption.text}</p>
          {viewingOption.rationale ? (
            <p
              className={cn(
                'text-xs sm:text-sm leading-5',
                isCorrect ? 'text-green-dark' : isWrong ? 'text-error' : 'text-steel-blue',
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
      ) : (
        <p className='text-xs text-muted-foreground italic m-auto text-center'>
          Chọn một đáp án để xem giải thích
        </p>
      )}
    </div>
  )
}
