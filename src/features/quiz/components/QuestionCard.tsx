'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  disabled?: boolean
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
  disabled,
  headerLeft,
  headerRight,
  showFlag,
  isFlagged,
  onToggleFlag,
  questionNumber,
}: QuestionCardProps) {
  const [viewingOptionId, setViewingOptionId] = useState<string | null>(correctOptionId)
  const prevCorrectRef = useRef(correctOptionId)

  useEffect(() => {
    if (prevCorrectRef.current === null && correctOptionId !== null) {
      prevCorrectRef.current = correctOptionId
      return
    }
    if (correctOptionId !== prevCorrectRef.current) {
      prevCorrectRef.current = correctOptionId
      setViewingOptionId(correctOptionId)
    }
  }, [correctOptionId])

  const handleOptionClick = useCallback(
    (optionId: string) => {
      if (correctOptionId === null && !disabled) {
        onSelect(optionId)
      }
      setViewingOptionId(optionId)
    },
    [correctOptionId, onSelect, disabled],
  )

  const viewingOption = viewingOptionId
    ? question.options.find((o) => o.id === viewingOptionId)
    : null

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

        <p className="font-serif text-base sm:text-lg text-foreground font-medium leading-relaxed indent-4">
          {question.questionText}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-y-2 sm:space-y-3'>
          {question.options.map((opt, idx) => {
            const status: OptionStatus = getOptionStatus(
              opt.id,
              selectedOptionId,
              correctOptionId,
              viewingOptionId,
            )
            return (
              <OptionButton
                key={opt.id}
                text={opt.text}
                label={OPTION_LABELS[idx] ?? String(idx)}
                status={status}
                onSelect={() => handleOptionClick(opt.id)}
              />
            )
          })}
        </div>

        <div className='lg:col-span-1'>
          {viewingOption ? (
            <div
              className={cn(
                'rounded-xl border-2 p-3 sm:p-4 space-y-2 sm:space-y-3 h-full min-h-25',
                viewingOption.id === correctOptionId
                  ? 'border-green-teal bg-green-teal-5'
                  : viewingOption.id === selectedOptionId && viewingOption.id !== correctOptionId
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
                    viewingOption.id === correctOptionId
                      ? 'text-green-dark'
                      : viewingOption.id === selectedOptionId && viewingOption.id !== correctOptionId
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
          ) : (
            <div className='rounded-xl border-2 border-dashed border-input p-3 sm:p-4 flex items-center justify-center h-full min-h-25 text-xs sm:text-sm text-muted-foreground'>
              Chọn một đáp án để xem giải thích
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
