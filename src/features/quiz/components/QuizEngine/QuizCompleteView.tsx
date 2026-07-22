'use client'

import { ImportDialog } from '@/features/quiz/components/ImportDialog'

interface QuizCompleteViewProps {
  correctCount: number
  totalQuestions: number
  incorrectCount: number
  pct: number
  onReview: () => void
  onRetryIncorrect: () => void
  onReset: () => void
  showImport: boolean
  importJson: string
  importError: string
  type?: string
  onSubmitImport: () => void
  setImportJson: (value: string) => void
  onCloseImport: () => void
}

export function QuizCompleteView({
  correctCount,
  totalQuestions,
  incorrectCount,
  pct,
  onReview,
  onRetryIncorrect,
  onReset,
  showImport,
  importJson,
  importError,
  type,
  onSubmitImport,
  setImportJson,
  onCloseImport,
}: QuizCompleteViewProps) {
  const gradeColor =
    pct >= 75
      ? 'var(--color-option-b)'
      : pct >= 60
        ? 'var(--color-option-a)'
        : 'var(--color-quiz-error)'
  const gradeLetter = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 45 ? 'C' : 'D'

  return (
    <div className='space-y-6 py-10 text-center max-w-lg mx-auto'>
      <div className='flex flex-col items-center gap-2'>
        <div
          className='w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black'
          style={{
            background: `conic-gradient(${gradeColor} ${pct}%, rgba(255,255,255,0.06) ${pct}%)`,
          }}
        >
          <span
            className='w-20 h-20 rounded-full bg-card flex items-center justify-center text-2xl font-black'
            style={{ color: gradeColor }}
          >
            {gradeLetter}
          </span>
        </div>
        <p className='text-lg font-semibold text-foreground'>Hoàn thành!</p>
        <p className='text-3xl font-bold text-foreground'>
          {correctCount}
          <span className='text-base font-normal text-muted-foreground'>/{totalQuestions}</span>
        </p>
        <p className='text-sm text-muted-foreground'>
          {pct >= 80 ? 'Xuất sắc! 🎉' : pct >= 60 ? 'Khá tốt! 👍' : 'Cần cố gắng hơn 💪'}
        </p>
      </div>

      <div className='flex flex-col sm:flex-row justify-center gap-2'>
        <button
          type='button'
          onClick={onReview}
          className='rounded-xl bg-muted px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80'
        >
          Xem lại bài
        </button>
        {incorrectCount > 0 && (
          <button
            type='button'
            onClick={onRetryIncorrect}
            className='rounded-xl bg-amber-100 px-5 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200'
          >
            Làm lại {incorrectCount} câu sai
          </button>
        )}
        <button
          type='button'
          onClick={onReset}
          className='rounded-xl bg-neutral-90 px-5 py-2.5 text-sm font-semibold text-neutral-0 transition-colors hover:bg-neutral-80'
        >
          Làm lại
        </button>
      </div>

      {showImport && (
        <ImportDialog
          type={type ?? 'word-form'}
          importJson={importJson}
          importError={importError}
          onImportJsonChange={setImportJson}
          onSubmitImport={onSubmitImport}
          onClose={onCloseImport}
        />
      )}
    </div>
  )
}
