'use client'

import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { QuizActiveView } from '@/features/quiz/components/QuizEngine/QuizActiveView'
import { QuizCompleteView } from '@/features/quiz/components/QuizEngine/QuizCompleteView'
import { QuizReviewPanel } from '@/features/quiz/components/QuizEngine/QuizReviewPanel'
import { useQuizEngine } from '@/features/quiz/hooks/useQuizEngine'
import type { Question } from '@/features/quiz/types'

export type { UseQuizEngineReturn } from '@/features/quiz/hooks/useQuizEngine'

interface QuizEngineProps {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
  disabled?: boolean
  onStatsUpdate?: (total: number, correct: number) => void
  onComplete?: (result: {
    correctCount: number
    totalCount: number
    typeStats: Record<string, { total: number; correct: number }>
    retryIncorrect: () => void
  }) => void
}

export function QuizEngine(props: QuizEngineProps) {
  const { type, difficulty, initialQuestions, disabled, onStatsUpdate, onComplete } = props
  const engine = useQuizEngine({ type, difficulty, initialQuestions, onStatsUpdate })

  useEffect(() => {
    if (engine.isComplete && onComplete) {
      onComplete({
        correctCount: engine.correctCount,
        totalCount: engine.totalQuestions,
        typeStats: engine.typeStats,
        retryIncorrect: engine.retryIncorrect,
      })
    }
  }, [
    engine.isComplete,
    onComplete,
    engine.correctCount,
    engine.totalQuestions,
    engine.typeStats,
    engine.retryIncorrect,
  ])

  if (engine.isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  if (engine.isComplete) {
    if (engine.showCompleteReview) {
      return (
        <QuizReviewPanel
          questions={engine.questions}
          attemptHistory={engine.attemptHistory}
          onBack={() => engine.setShowCompleteReview(false)}
        />
      )
    }

    return (
      <QuizCompleteView
        correctCount={engine.correctCount}
        totalQuestions={engine.totalQuestions}
        incorrectCount={engine.incorrectCount}
        pct={engine.pct}
        onReview={() => engine.setShowCompleteReview(true)}
        onRetryIncorrect={engine.retryIncorrect}
        onReset={engine.reset}
        showImport={engine.showImport}
        importJson={engine.importJson}
        importError={engine.importError}
        type={type}
        onSubmitImport={engine.handleSubmitImport}
        setImportJson={engine.setImportJson}
        onCloseImport={engine.closeImport}
      />
    )
  }

  if (!engine.currentQuestion) {
    return null
  }

  return (
      <QuizActiveView
        currentQuestion={engine.currentQuestion}
        selectedOptionId={engine.selectedOptionId}
        submitting={engine.submitting}
        result={engine.result}
        currentIdx={engine.currentIdx}
        totalQuestions={engine.totalQuestions}
        questions={engine.questions}
        answeredMap={engine.answeredMap}
        correctMap={engine.correctMap}
        flagged={engine.flagged}
        disabled={disabled}
        onSelect={engine.handleSelect}
        onToggleFlag={engine.toggleFlag}
        onGoToQuestion={engine.goToQuestion}
        onNext={engine.handleNext}
      />
  )
}
