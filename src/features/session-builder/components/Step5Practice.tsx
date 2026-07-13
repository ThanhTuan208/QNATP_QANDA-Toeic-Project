'use client'

import { ArrowLeft, RefreshCw } from 'lucide-react'
import { QuizEngine } from '@/features/quiz/components/QuizEngine/QuizEngine'
import { useQuizEngine } from '@/features/quiz/hooks/useQuizEngine'
import { sessionQuestionsToQuizQuestions } from '@/features/session-builder/utils/questions'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'

interface Step5PracticeProps {
  questions: SessionQuestion[]
  onBack: () => void
  onComplete: (attempts: SessionAttempt[]) => void
}

function PracticeSession({
  questions,
  onComplete,
  onBack,
}: {
  questions: SessionQuestion[]
  onComplete: (attempts: SessionAttempt[]) => void
  onBack: () => void
}) {
  const quizQuestions = sessionQuestionsToQuizQuestions(questions)
  const quizEngine = useQuizEngine({ initialQuestions: quizQuestions })

  if (quizEngine.isComplete) {
    const attempts: SessionAttempt[] = quizEngine.attemptHistory.map((r, i) => ({
      tempQuestionId: r.questionId,
      selectedOptionId: r.selectedOptionId,
      isCorrect: r.isCorrect,
      timeSpentMs: 0,
      createdAt: Date.now() + i,
    }))

    const correctCount = quizEngine.attemptHistory.filter((r) => r.isCorrect).length
    const totalCount = quizEngine.attemptHistory.length

    return (
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h3 className='text-2xl font-bold text-foreground'>Practice Complete</h3>
          <p className='text-4xl font-bold text-primary'>
            {correctCount}/{totalCount}
          </p>
          <p className='text-sm text-muted-foreground'>
            {totalCount > 0
              ? `Accuracy: ${Math.round((correctCount / totalCount) * 100)}%`
              : 'No questions answered'}
          </p>
        </div>

        {Object.entries(quizEngine.typeStats).length > 0 && (
          <div className='bg-card border border-border rounded-xl p-4 space-y-2'>
            <h4 className='text-sm font-semibold text-foreground'>Breakdown</h4>
            {Object.entries(quizEngine.typeStats).map(([type, stat]) => (
              <div key={type} className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>{type}</span>
                <span className='font-medium text-foreground'>
                  {stat.correct}/{stat.total}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => {
              quizEngine.retryIncorrect()
              onComplete(attempts)
            }}
            className='flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2'
          >
            <RefreshCw className='size-4' />
            Retry Incorrect
          </button>
          <button
            type='button'
            onClick={onBack}
            className='flex-1 bg-muted text-muted-foreground py-3 rounded-xl font-bold hover:bg-neutral-5 transition-all'
          >
            Back to Preview
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <button
        type='button'
        onClick={onBack}
        className='flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft className='size-4' />
        Back
      </button>
      <QuizEngine initialQuestions={quizQuestions} />
    </div>
  )
}

export function Step5Practice({ questions, onBack, onComplete }: Step5PracticeProps) {
  if (questions.length === 0) {
    return (
      <div className='text-center py-12 text-muted-foreground'>
        No questions available. Please go back and configure your session.
      </div>
    )
  }

  return <PracticeSession questions={questions} onComplete={onComplete} onBack={onBack} />
}
