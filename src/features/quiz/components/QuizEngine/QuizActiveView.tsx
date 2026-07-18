'use client'

import { ChevronLeft, ChevronRight, Loader2, Trophy } from 'lucide-react'
import { QuestionCard } from '@/features/quiz/components/QuestionCard'
import type { AttemptResult, Question } from '@/features/quiz/types'
import { QuestionNavGrid } from '@/features/session-builder/components/practice/QuestionNavGrid'
import { cn } from '@/lib/utils'

interface QuizActiveViewProps {
  currentQuestion: Question
  selectedOptionId: string | null
  submitting: boolean
  result: AttemptResult | null
  currentIdx: number
  totalQuestions: number
  questions: Question[]
  answeredMap: Record<number, string>
  correctMap: Record<number, boolean>
  flagged: Set<number>
  onSelect: (optionId: string) => void
  onToggleFlag: () => void
  onGoToQuestion: (index: number) => void
  onNext: () => void
}

export function QuizActiveView({
  currentQuestion,
  selectedOptionId,
  submitting,
  result,
  currentIdx,
  totalQuestions,
  questions,
  answeredMap,
  correctMap,
  flagged,
  onSelect,
  onToggleFlag,
  onGoToQuestion,
  onNext,
}: QuizActiveViewProps) {
  const answeredCount = Object.keys(answeredMap).length
  const isLastQuestion = currentIdx === totalQuestions - 1
  const isAnswered = result !== null

  return (
    <div className='mx-auto'>
      <div className='h-0.5 w-full bg-muted rounded-full mb-4 overflow-hidden'>
        <div
          className='h-full transition-all duration-500 rounded-full'
          style={{
            width: `${totalQuestions > 0 ? ((currentIdx + (isAnswered ? 1 : 0)) / totalQuestions) * 100 : 0
              }%`,
            background: 'linear-gradient(90deg, var(--color-option-a), var(--color-option-b))',
          }}
        />
      </div>

      <div className='flex items-center justify-between mb-4 text-xs text-muted-foreground'>
        <span>
          Câu {currentIdx + 1}/{totalQuestions}
        </span>
        <span>
          Đã làm: {answeredCount}/{totalQuestions}
          {result?.isCorrect && (
            <span className='ml-2 text-emerald-500 font-medium'>· Đúng</span>
          )}
        </span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8'>
        <div className='min-w-0 space-y-6'>
          <QuestionCard
            key={`${currentQuestion.id}-${currentIdx}`}
            question={currentQuestion}
            selectedOptionId={selectedOptionId}
            correctOptionId={result?.correctOptionId ?? null}
            onSelect={onSelect}
            headerRight={
              <div className='flex items-center gap-2'>
                {submitting && (
                  <span className='flex items-center gap-1 text-xs text-muted-foreground animate-pulse'>
                    <Loader2 className='h-3 w-3 animate-spin' />
                    <span className='hidden sm:inline'>Đang kiểm tra...</span>
                  </span>
                )}
              </div>
            }
            showFlag
            isFlagged={flagged.has(currentIdx)}
            onToggleFlag={onToggleFlag}
            questionNumber={currentIdx + 1}
          />

          <div className='flex items-center justify-between pt-2 pb-4'>
            <button
              type='button'
              onClick={() => currentIdx > 0 && onGoToQuestion(currentIdx - 1)}
              disabled={currentIdx === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                currentIdx === 0
                  ? 'opacity-25 cursor-not-allowed'
                  : 'bg-muted text-foreground hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98]',
              )}
            >
              <ChevronLeft className='w-4 h-4' />
              Câu trước
            </button>

            <div className='flex gap-1.5 lg:hidden'>
              {questions.map((_, i) => (
                <button
                  type='button'
                  key={i.toString()}
                  onClick={() => onGoToQuestion(i)}
                  className='transition-all'
                  style={{
                    width: i === currentIdx ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i === currentIdx
                        ? 'var(--color-option-a)'
                        : answeredMap[i]
                          ? 'rgba(var(--color-option-b-rgb), 0.25)'
                          : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>

            {isLastQuestion ? (
              <button
                type='button'
                onClick={isAnswered ? onNext : undefined}
                disabled={!isAnswered}
                className={cn(
                  'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]',
                  isAnswered
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
              >
                Nộp bài
                <Trophy className='w-4 h-4' />
              </button>
            ) : (
              <button
                type='button'
                onClick={onNext}
                disabled={!isAnswered}
                className={cn(
                  'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]',
                  isAnswered
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
              >
                Câu tiếp
                <ChevronRight className='w-4 h-4' />
              </button>
            )}
          </div>
        </div>

        <aside className='hidden lg:flex flex-col gap-4'>
          <div>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-xs font-semibold tracking-widest uppercase text-muted-foreground'>
                Câu hỏi
              </span>
              <span className='text-xs font-mono text-primary'>
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <QuestionNavGrid
              total={totalQuestions}
              currentIndex={currentIdx}
              answered={answeredMap}
              correctMap={correctMap}
              flagged={flagged}
              onSelect={onGoToQuestion}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            {[
              {
                color: 'var(--color-option-a)',
                label: 'Đang làm',
                style: { background: 'var(--color-option-a)', borderRadius: '4px' },
              },
              {
                color: 'var(--color-option-b)',
                label: 'Đúng',
                style: {
                  background: 'rgba(var(--color-option-b-rgb), 0.2)',
                  border: '1px solid rgba(var(--color-option-b-rgb), 0.3)',
                  borderRadius: '4px',
                },
              },
              {
                color: 'var(--color-quiz-error)',
                label: 'Sai',
                style: {
                  background: 'rgba(var(--color-quiz-error-rgb), 0.2)',
                  border: '1px solid rgba(var(--color-quiz-error-rgb), 0.3)',
                  borderRadius: '4px',
                },
              },
              {
                color: 'var(--color-muted-subtle)',
                label: 'Chưa làm',
                style: { background: 'rgba(255,255,255,0.05)', borderRadius: '4px' },
              },
            ].map(({ label, style }) => (
              <div key={label} className='flex items-center gap-2'>
                <div style={{ width: 12, height: 12, flexShrink: 0, ...style }} />
                <span className='text-xs text-muted-foreground'>{label}</span>
              </div>
            ))}
            <div className='flex items-center gap-2 mt-0.5'>
              <div
                style={{
                  width: 12,
                  height: 12,
                  flexShrink: 0,
                  background: 'var(--color-option-c)',
                  borderRadius: '50%',
                }}
              />
              <span className='text-xs text-muted-foreground'>Đã đánh dấu</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
