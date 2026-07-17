'use client'

import { Loader2 } from 'lucide-react'
import { AnimatedLoader } from '@/components/common/AnimatedLoader'
import { ImportDialog } from '@/features/quiz/components/ImportDialog'
import { QuestionCard } from '@/features/quiz/components/QuestionCard'
import { RationaleBox } from '@/features/quiz/components/RationaleBox'
import { ResultBreakdown } from '@/features/quiz/components/ResultBreakdown'
import { ReviewPanel } from '@/features/quiz/components/ReviewPanel'
import { SaveButton } from '@/features/quiz/components/SaveButton'
import { useQuizEngine } from '@/features/quiz/hooks/useQuizEngine'
import type { Question } from '@/features/quiz/types'

interface QuizEngineProps {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
  onStatsUpdate?: (total: number, correct: number) => void
  hideImport?: boolean
}

export function QuizEngine(props: QuizEngineProps) {
  const { hideImport = false, ...engineProps } = props
  const {
    currentQuestion,
    selectedOptionId,
    submitting,
    result,
    currentIdx,
    totalQuestions,
    isLoading,
    isComplete,
    isEmpty,
    typeStats,
    questions,
    attemptHistory,
    showImport,
    importJson,
    importError,
    handleSelect,
    handleNext,
    handleOpenImport,
    handleSubmitImport,
    setImportJson,
    closeImport,
    reset,
    retryIncorrect,
    incorrectCount,
  } = useQuizEngine(engineProps)

  if (isLoading) {
    return <AnimatedLoader fullScreen={false} />
  }

  if (isEmpty) {
    return (
      <div className='py-20 text-center space-y-4'>
        <p className='text-muted-foreground'>Chưa có câu hỏi nào.</p>
        {!hideImport && (
          <>
            <button
              type='button'
              onClick={handleOpenImport}
              className='rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90'
            >
              + Thêm câu hỏi
            </button>
            {showImport && (
              <ImportDialog
                type={engineProps.type ?? 'word-form'}
                importJson={importJson}
                importError={importError}
                onImportJsonChange={setImportJson}
                onSubmitImport={handleSubmitImport}
                onClose={closeImport}
              />
            )}
          </>
        )}
      </div>
    )
  }

  if (isComplete) {
    const correctCount = Object.values(typeStats).reduce((sum, s) => sum + s.correct, 0)
    const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    return (
      <div className='space-y-5 sm:space-y-6 py-6 sm:py-10'>
        <div className='text-center space-y-2'>
          <p className='text-base sm:text-lg font-semibold text-foreground'>Hoàn thành!</p>
          <p className='text-3xl sm:text-4xl font-bold text-foreground'>
            {correctCount}
            <span className='text-base sm:text-lg font-normal text-muted-foreground'>/{totalQuestions}</span>
          </p>
          <p className='text-xs sm:text-sm text-muted-foreground'>
            {pct >= 80 ? 'Xuất sắc! 🎉' : pct >= 60 ? 'Khá tốt! 👍' : 'Cần cố gắng hơn 💪'}
          </p>
        </div>

        <ResultBreakdown typeStats={typeStats} />

        <ReviewPanel questions={questions} attemptHistory={attemptHistory} />

        <div className='flex flex-col sm:flex-row justify-center gap-2 sm:gap-3'>
          {incorrectCount > 0 && (
            <button
              type='button'
              onClick={retryIncorrect}
              className='rounded-xl bg-amber-100 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200'
            >
              Làm lại {incorrectCount} câu sai
            </button>
          )}
          <button
            type='button'
            onClick={reset}
            className='rounded-xl bg-neutral-90 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-neutral-0 transition-colors hover:bg-neutral-80'
          >
            Làm lại
          </button>
          {!hideImport && (
            <>
              <button
                type='button'
                onClick={handleOpenImport}
                className='rounded-xl bg-primary px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90'
              >
                + Thay câu hỏi mới
              </button>
              {showImport && (
                <ImportDialog
                  type={engineProps.type ?? 'word-form'}
                  importJson={importJson}
                  importError={importError}
                  onImportJsonChange={setImportJson}
                  onSubmitImport={handleSubmitImport}
                  onClose={closeImport}
                />
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-5xl py-4 sm:py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-10'>
        <div className='min-w-0'>
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              selectedOptionId={selectedOptionId}
              correctOptionId={result?.correctOptionId ?? null}
              onSelect={handleSelect}
              headerLeft={<SaveButton questionId={currentQuestion.id} />}
              headerRight={
                <div className='flex items-center gap-2 sm:gap-3'>
                  {submitting && (
                    <span className='flex items-center gap-1 text-xs text-green-dark'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      <span className='hidden sm:inline'>Đang kiểm tra...</span>
                    </span>
                  )}
                  <span className='text-xs sm:text-sm text-muted-foreground whitespace-nowrap'>
                    Câu {currentIdx + 1} / {totalQuestions}
                  </span>
                </div>
              }
            />
          )}
        </div>

        <div className='space-y-4'>
          {result ? (
            <div className='lg:sticky lg:top-24'>
              <RationaleBox
                isCorrect={result.isCorrect}
                rationale={result.rationale}
                onNext={handleNext}
                hasNext={currentIdx < totalQuestions - 1}
              />
            </div>
          ) : (
            <div className='hidden lg:flex lg:sticky lg:top-24 rounded-xl border-2 border-dashed border-border p-6 text-center text-xs sm:text-sm text-muted-foreground items-center justify-center min-h-[200px]'>
              Chọn đáp án để xem kết quả
            </div>
          )}
        </div>
      </div>

      {showImport && (
        <ImportDialog
          type={engineProps.type ?? 'word-form'}
          importJson={importJson}
          importError={importError}
          onImportJsonChange={setImportJson}
          onSubmitImport={handleSubmitImport}
          onClose={closeImport}
        />
      )}
    </div>
  )
}
