'use client'

import { CheckCircle2, ChevronDown, ChevronRight, XCircle } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { usePracticeOptions } from '@/contexts/PracticeOptionsContext'
import { OPTION_ACCENT_COLORS } from '@/features/session-builder/constants/practice-ui'
import { useListPracticeView } from '@/features/session-builder/hooks/useListPracticeView'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'
import { cn } from '@/lib/utils'

interface ListPracticeViewProps {
  questions: SessionQuestion[]
  onComplete: (attempts: SessionAttempt[]) => void
  onBack: () => void
}

export function ListPracticeView({ questions, onComplete, onBack }: ListPracticeViewProps) {
  const { answers, completed, expanded, allAnswered, handleComplete, handleSelect, setExpanded } =
    useListPracticeView(questions, onComplete)
  const { showExplanations } = usePracticeOptions()

  return (
    <div className='space-y-4'>
      {!completed && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Đã trả lời {Object.keys(answers).length}/{questions.length}
          </p>
          <Button
            buttonType='fill'
            onClick={handleComplete}
            disabled={!allAnswered}
            className='text-xs sm:text-sm'
          >
            Hoàn thành
          </Button>
        </div>
      )}

      <div className='space-y-3'>
        {questions.map((question, index) => {
          const selectedId = answers[question.tempId]
          const isComplete = completed
          const isCorrect = isComplete && selectedId === question.correctOptionId
          const isWrong =
            isComplete && selectedId != null && selectedId !== question.correctOptionId
          const isExpanded = expanded[question.tempId] ?? true

          return (
            <div
              key={question.tempId}
              className={cn(
                'rounded-xl border transition-all duration-300 overflow-hidden',
                isCorrect && 'border-emerald-500/40 bg-emerald-500/5',
                isWrong && 'border-rose-500/40 bg-rose-500/5',
                !isComplete && 'border-border bg-card hover:border-primary/20',
              )}
            >
              <button
                type='button'
                onClick={() => setExpanded((prev) => ({ ...prev, [question.tempId]: !isExpanded }))}
                className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors'
              >
                {isExpanded ? (
                  <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
                ) : (
                  <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
                )}

                <span className='flex items-center gap-2 min-w-0 shrink-0'>
                  <span className='inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold'>
                    {index + 1}
                  </span>
                </span>

                <div className='flex items-center gap-1.5 min-w-0 flex-wrap'>
                  <span className='inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground'>
                    Part {question.part}
                  </span>
                  <span className='inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground'>
                    {question.type}
                  </span>
                </div>

                <div className='ml-auto flex items-center gap-2 shrink-0'>
                  {selectedId && !isComplete && (
                    <span className='text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded'>
                      SELECTED
                    </span>
                  )}
                  {isCorrect && <CheckCircle2 className='size-4 text-emerald-500' />}
                  {isWrong && <XCircle className='size-4 text-rose-500' />}
                </div>
              </button>

              {isExpanded && (
                <div className='px-4 pb-4 space-y-3 border-t border-border pt-3'>
                  <p className='text-sm font-medium text-foreground leading-relaxed'>
                    {question.questionText}
                  </p>

                  <div className='space-y-2'>
                    {question.options.map((opt, idx) => {
                      const isOptSelected = selectedId === opt.id
                      const isOptCorrect = isComplete && opt.id === question.correctOptionId
                      const isOptWrong = isComplete && isOptSelected && !isOptCorrect
                      const optLetter = String.fromCharCode(65 + idx)
                      const accentColor = OPTION_ACCENT_COLORS[idx] ?? 'var(--color-option-a)'

                      return (
                        <button
                          key={opt.id}
                          type='button'
                          disabled={isComplete}
                          onClick={() => handleSelect(question.tempId, opt.id)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200',
                            !isComplete && 'hover:scale-[1.01] active:scale-[0.99]',
                            isComplete ? 'cursor-default' : 'cursor-pointer',
                            isOptCorrect && 'border-emerald-500/40 bg-emerald-500/10',
                            isOptWrong && 'border-rose-500/40 bg-rose-500/10',
                            !isComplete && isOptSelected && 'border-primary bg-primary/10',
                            !isComplete &&
                              !isOptSelected &&
                              'border-border bg-card hover:border-primary/30 hover:bg-primary/5',
                          )}
                        >
                          <span
                            className={cn(
                              'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200',
                              isOptCorrect && 'bg-emerald-500 text-white',
                              isOptWrong && 'bg-rose-500 text-white',
                              !isComplete && isOptSelected && 'bg-primary text-primary-foreground',
                              !isComplete && !isOptSelected && 'bg-muted text-muted-foreground',
                            )}
                            style={
                              !isComplete && !isOptSelected
                                ? { backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`, color: accentColor }
                                : undefined
                            }
                          >
                            {optLetter}
                          </span>

                          <span
                            className={cn(
                              'flex-1 text-sm leading-relaxed',
                              isOptCorrect && 'text-emerald-600 dark:text-emerald-400 font-medium',
                              isOptWrong && 'text-rose-600 dark:text-rose-400',
                              !isComplete && isOptSelected && 'text-primary font-medium',
                              !isComplete && !isOptSelected && 'text-foreground',
                            )}
                          >
                            {opt.text}
                          </span>

                          {isOptCorrect && (
                            <CheckCircle2 className='size-5 shrink-0 text-emerald-500' />
                          )}
                          {isOptWrong && <XCircle className='size-5 shrink-0 text-rose-500' />}
                        </button>
                      )
                    })}
                  </div>

                  {isComplete && showExplanations && (
                    <div className='rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-foreground'>
                      <span className='font-semibold text-primary block mb-1'>Giải thích:</span>
                      {question.rationale || 'Không có giải thích.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {completed && (
        <div className='flex justify-center pt-2'>
          <Button buttonType='outline' onClick={onBack} className='text-xs sm:text-sm'>
            Quay lại
          </Button>
        </div>
      )}
    </div>
  )
}
