'use client'

import { ArrowLeft } from 'lucide-react'
import { QuizEngine } from '@/features/quiz/components/QuizEngine/QuizEngine'
import { CompletionScreen } from '@/features/session-builder/components/practice/CompletionScreen'
import { TimerBadge } from '@/features/session-builder/components/practice/TimerBadge'
import { usePracticeEngine } from '@/features/session-builder/hooks/usePracticeEngine'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'

interface PracticeSessionProps {
  questions: SessionQuestion[]
  timeLimit?: number
  onComplete: (attempts: SessionAttempt[]) => void
  onBack: () => void
}

export function PracticeSession({
  questions,
  timeLimit,
  onComplete,
  onBack,
}: PracticeSessionProps) {
  const {
    quizQuestions,
    hasTimeLimit,
    timeUp,
    timeLeft,
    showCompletion,
    completionData,
    onQuizComplete,
  } = usePracticeEngine({ questions, timeLimit, onComplete, onBack })

  if (showCompletion && completionData) {
    return (
      <CompletionScreen
        correctCount={completionData.correctCount}
        totalCount={completionData.totalCount}
        typeStats={completionData.typeStats}
        timeTaken={completionData.timeTaken}
        onRetryIncorrect={completionData.onRetryIncorrect}
        onBack={completionData.onBack}
      />
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <button
          type='button'
          onClick={onBack}
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowLeft className='size-4' />
          Quay lại
        </button>

        <TimerBadge timeLeft={timeLeft} timeUp={timeUp} hasTimeLimit={hasTimeLimit} />
      </div>

      <QuizEngine initialQuestions={quizQuestions} disabled={timeUp} onComplete={onQuizComplete} />
    </div>
  )
}
