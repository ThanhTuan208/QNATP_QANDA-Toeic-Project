'use client'

import { cn } from '@/lib/utils'
import { OPTION_LABELS } from '../../constants'
import { getOptionStatus } from '../../controllers/question.controller'
import type { OptionStatus } from '../../types'
import { OptionButton } from '../OptionButton'

interface QuestionCardOption {
  id: string
  text: string
  order: number
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
}

export function QuestionCard({
  question,
  selectedOptionId,
  correctOptionId,
  onSelect,
}: QuestionCardProps) {
  const isAnswered = correctOptionId !== null

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <span className='inline-block rounded-full bg-steel-blue-10 px-3 py-1 text-xs font-medium text-steel-blue'>
          {question.type}
        </span>
        <p className='text-lg leading-7 text-foreground'>{question.questionText}</p>
      </div>

      <div className='space-y-3'>
        {question.options.map((opt, idx) => {
          const status: OptionStatus = getOptionStatus(opt.id, selectedOptionId, correctOptionId)
          return (
            <OptionButton
              key={opt.id}
              text={opt.text}
              label={OPTION_LABELS[idx] ?? String(idx)}
              status={status}
              onSelect={() => onSelect(opt.id)}
            />
          )
        })}
      </div>

      {isAnswered && question.hint && (
        <div
          className={cn(
            'rounded-xl border p-4 text-sm',
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
