'use client'

import { Loader2 } from 'lucide-react'
import { AnimatedLoader } from '@/components/common/AnimatedLoader'
import { ImportDialog } from '@/features/quiz/components/ImportDialog'
import { QuestionCard } from '@/features/quiz/components/QuestionCard'
import { RationaleBox } from '@/features/quiz/components/RationaleBox'
import { useQuizEngine } from '@/features/quiz/hooks/useQuizEngine'
import type { Question } from '@/features/quiz/types'

interface QuizEngineProps {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
  onStatsUpdate?: (total: number, correct: number) => void
}

export function QuizEngine(props: QuizEngineProps) {
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
  } = useQuizEngine(props)

  if (isLoading) {
    return <AnimatedLoader fullScreen={false} />
  }

  if (isEmpty) {
    return (
      <div className='py-20 text-center space-y-4'>
        <p className='text-muted-foreground'>Chưa có câu hỏi nào.</p>
        <button
          type='button'
          onClick={handleOpenImport}
          className='rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90'
        >
          + Thêm câu hỏi
        </button>
        {showImport && (
          <ImportDialog
            type={props.type ?? 'word-form'}
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

  if (isComplete) {
    return (
      <div className='space-y-4 py-10 text-center'>
        <p className='text-lg font-semibold text-foreground'>Hoàn thành!</p>
        <p className='text-muted-foreground'>Bạn đã trả lời {totalQuestions} câu hỏi.</p>
        <div className='flex justify-center gap-3'>
          <button
            type='button'
            onClick={reset}
            className='rounded-xl bg-neutral-90 px-6 py-3 text-sm font-semibold text-neutral-0 transition-colors hover:bg-neutral-80'
          >
            Làm lại
          </button>
          <button
            type='button'
            onClick={handleOpenImport}
            className='rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90'
          >
            + Thay câu hỏi mới
          </button>
        </div>
        {showImport && (
          <ImportDialog
            type={props.type ?? 'word-form'}
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

  return (
    <div className='mx-auto max-w-2xl space-y-6 py-8'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          <span>
            Câu {currentIdx + 1} / {totalQuestions}
          </span>
          {submitting && (
            <span className='ml-3 flex items-center gap-1 text-green-dark'>
              <Loader2 className='h-3 w-3 animate-spin' />
              Đang kiểm tra...
            </span>
          )}
        </div>
        <button
          type='button'
          onClick={handleOpenImport}
          className='text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2'
        >
          + Tự nhập câu hỏi
        </button>
      </div>

      {currentQuestion && (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          correctOptionId={result?.correctOptionId ?? null}
          onSelect={handleSelect}
        />
      )}

      {result && (
        <RationaleBox
          isCorrect={result.isCorrect}
          rationale={result.rationale}
          onNext={handleNext}
          hasNext={currentIdx < totalQuestions - 1}
        />
      )}

      {showImport && (
        <ImportDialog
          type={props.type ?? 'word-form'}
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
