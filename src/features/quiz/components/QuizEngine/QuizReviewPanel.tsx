'use client'

import { usePracticeOptions } from '@/contexts/PracticeOptionsContext'
import type { AttemptRecord, Question } from '@/features/quiz/types'

interface QuizReviewPanelProps {
  questions: Question[]
  attemptHistory: AttemptRecord[]
  onBack: () => void
}

export function QuizReviewPanel({ questions, attemptHistory, onBack }: QuizReviewPanelProps) {
  const { showExplanations } = usePracticeOptions()
  return (
    <div className='space-y-4 py-4'>
      <button
        type='button'
        onClick={onBack}
        className='text-sm text-muted-foreground hover:text-foreground transition-colors'
      >
        ← Quay lại
      </button>
      <div className='flex flex-col gap-4 max-h-[70vh] overflow-y-auto'>
        {questions.map((q, i) => {
          const attempt = attemptHistory.find((a) => a.questionId === q.id)
          const userAns = attempt?.selectedOptionId
          const isCorrect = attempt?.isCorrect ?? false
          const statusColor = !userAns
            ? 'var(--color-muted-subtle)'
            : isCorrect
              ? 'var(--color-option-b)'
              : 'var(--color-quiz-error)'

          return (
            <div
              key={q.id}
              className='rounded-xl border p-4'
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: `color-mix(in srgb, ${statusColor} 19%, transparent)`,
              }}
            >
              <div className='flex items-start gap-3 mb-3'>
                <span
                  className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5'
                  style={{
                    background: `color-mix(in srgb, ${statusColor} 12.5%, transparent)`,
                    color: statusColor,
                  }}
                >
                  {i + 1}
                </span>
                <p className='text-sm text-foreground leading-relaxed'>{q.questionText}</p>
              </div>
              <div className='flex gap-2 flex-wrap mb-3'>
                {q.options.map((opt) => {
                  const isUser = opt.id === userAns
                  const isRight = opt.id === q.correctOptionId
                  let style: Record<string, string> = {
                    background: 'rgba(255,255,255,0.04)',
                    color: 'var(--color-muted-subtle)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }
                  if (isRight)
                    style = {
                      background: 'rgba(var(--color-option-b-rgb), 0.15)',
                      color: 'var(--color-option-b)',
                      border: '1px solid rgba(var(--color-option-b-rgb), 0.3)',
                    }
                  else if (isUser && !isRight)
                    style = {
                      background: 'rgba(var(--color-quiz-error-rgb), 0.15)',
                      color: 'var(--color-quiz-error)',
                      border: '1px solid rgba(var(--color-quiz-error-rgb), 0.3)',
                    }
                  return (
                    <span
                      key={opt.id}
                      className='px-3 py-1 rounded-lg text-xs font-medium'
                      style={style}
                    >
                      {opt.id}. {opt.text}
                    </span>
                  )
                })}
              </div>
              {showExplanations && (
                <p className='text-xs text-muted-foreground leading-relaxed border-t border-white/5 pt-2'>
                  {attempt?.rationale ?? q.hint ?? 'Không có giải thích.'}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
