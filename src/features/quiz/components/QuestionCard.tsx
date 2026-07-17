'use client'

import { OptionButton } from '@/features/quiz/components/OptionButton'
import { OPTION_LABELS } from '@/features/quiz/constants'
import type { OptionStatus } from '@/features/quiz/types'
import { getOptionStatus } from '@/features/quiz/utils/question.utils'
import { cn } from '@/lib/utils'

interface QuestionCardOption {
  id: string
  text: string
  order: number
  rationale?: string
}

interface QuestionCardQuestion {
  id: string
  questionText: string
  type: string
  hint?: string | null
  options: QuestionCardOption[]
}

interface QuestionCardProps {
  question: QuestionCardQuestion
  selectedOptionId: string | null
  correctOptionId: string | null
  onSelect: (optionId: string) => void
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
}

export function QuestionCard({
  question,
  selectedOptionId,
  correctOptionId,
  onSelect,
  headerLeft,
  headerRight,
}: QuestionCardProps) {
  const isAnswered = correctOptionId !== null

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='space-y-2'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
            {headerLeft}
            <span className='inline-block rounded-full bg-green-teal-10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-green-teal shrink-0'>
              {question.type}
            </span>
          </div>
          {headerRight && (
            <div className='shrink-0'>{headerRight}</div>
          )}
        </div>
        <p className='text-base sm:text-lg leading-6 sm:leading-7 text-foreground'>{question.questionText}</p>
      </div>

      <div className='space-y-2 sm:space-y-3'>
        {question.options.map((opt, idx) => {
          const status: OptionStatus = getOptionStatus(opt.id, selectedOptionId, correctOptionId)
          return (
            <OptionButton
              key={opt.id}
              text={opt.text}
              label={OPTION_LABELS[idx] ?? String(idx)}
              status={status}
              rationale={opt.rationale}
              onSelect={() => onSelect(opt.id)}
            />
          )
        })}
      </div>

      {isAnswered && question.hint && (
        <div
          className={cn(
            'rounded-xl border p-3 sm:p-4 text-xs sm:text-sm',
            selectedOptionId === correctOptionId
              ? 'border-green-teal-20 bg-green-teal-5 text-green-dark'
              : 'border-error/20 bg-error-soft text-error',
          )}
        >
          <span className='font-medium'>Hint: </span>
          {question.hint}
        </div>
      )}
    </div>
  )
}
