'use client'

import { ArrowLeft } from 'lucide-react'
import { QuizEngine } from '@/features/quiz/components/QuizEngine/QuizEngine'
import { useQuizEngine } from '@/features/quiz/hooks/useQuizEngine'
import { CompletionScreen } from '@/features/session-builder/components/practice/CompletionScreen'
import {
  attemptRecordToSessionAttempt,
  sessionQuestionsToQuizQuestions,
} from '@/features/session-builder/utils/questions'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'

interface PracticeSessionProps {
  questions: SessionQuestion[]
  onComplete: (attempts: SessionAttempt[]) => void
  onBack: () => void
}

export function PracticeSession({ questions, onComplete, onBack }: PracticeSessionProps) {
  const quizQuestions = sessionQuestionsToQuizQuestions(questions)
  const quizEngine = useQuizEngine({ initialQuestions: quizQuestions })

  if (quizEngine.isComplete) {
    const attempts = quizEngine.attemptHistory.map(attemptRecordToSessionAttempt)
    const correctCount = quizEngine.attemptHistory.filter((r) => r.isCorrect).length
    const totalCount = quizEngine.attemptHistory.length

    return (
      <CompletionScreen
        correctCount={correctCount}
        totalCount={totalCount}
        typeStats={quizEngine.typeStats}
        onRetryIncorrect={() => {
          quizEngine.retryIncorrect()
          onComplete(attempts)
        }}
        onBack={onBack}
      />
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
