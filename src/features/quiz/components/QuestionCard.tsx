'use client'

import { BookOpen, Flag } from 'lucide-react'
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
  showFlag?: boolean
  isFlagged?: boolean
  onToggleFlag?: () => void
  questionNumber?: number
}

export function QuestionCard({
  question,
  selectedOptionId,
  correctOptionId,
  onSelect,
  headerLeft,
  headerRight,
  showFlag,
  isFlagged,
  onToggleFlag,
  questionNumber,
}: QuestionCardProps) {
  const isAnswered = correctOptionId !== null
  const correctOption = question.options.find((o) => o.id === correctOptionId)
  const rationale = correctOption?.rationale

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap'>
            {headerLeft}
            <span className='inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground shrink-0'>
              {question.type}
            </span>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            {showFlag && (
              <button
                type='button'
                onClick={onToggleFlag}
                title='Đánh dấu câu này'
                className='shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110'
                style={{
                  background: isFlagged ? 'rgba(var(--color-option-c-rgb), 0.15)' : 'transparent',
                  border: `1px solid ${isFlagged ? 'rgba(var(--color-option-c-rgb), 0.4)' : 'transparent'}`,
                }}
              >
                <Flag
                  className='w-3.5 h-3.5'
                  style={{
                    color: isFlagged ? 'var(--color-option-c)' : 'var(--color-muted-subtle)',
                    fill: isFlagged ? 'var(--color-option-c)' : 'none',
                  }}
                />
              </button>
            )}
            {headerRight}
          </div>
        </div>

        <p className='text-base sm:text-lg leading-6 sm:leading-7 text-foreground font-medium'>
          {question.questionText}
        </p>
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

      {isAnswered && (
        <div
          className={cn(
            'rounded-xl border p-4 flex gap-3',
            selectedOptionId === correctOptionId
              ? 'border-primary/20 bg-primary/5'
              : 'border-rose-500/20 bg-rose-500/5',
          )}
        >
          <BookOpen
            className='w-4 h-4 shrink-0 mt-0.5'
            style={{
              color: selectedOptionId === correctOptionId ? 'var(--color-option-a)' : 'var(--color-quiz-error)',
            }}
          />
          <div>
            <p
              className='text-xs font-semibold mb-1'
              style={{
                color: selectedOptionId === correctOptionId ? 'var(--color-option-a)' : 'var(--color-quiz-error)',
              }}
            >
              Giải thích
            </p>
            <p className='text-sm leading-relaxed text-foreground/80'>
              {rationale ?? question.hint ?? 'Không có giải thích.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
