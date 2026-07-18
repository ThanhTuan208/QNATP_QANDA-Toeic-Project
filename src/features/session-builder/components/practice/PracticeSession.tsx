'use client'

import { useCallback, useRef, useState } from 'react'
import { ArrowLeft, Clock } from 'lucide-react'
import { QuizEngine } from '@/features/quiz/components/QuizEngine/QuizEngine'
import { CompletionScreen } from '@/features/session-builder/components/practice/CompletionScreen'
import {
  PRACTICE_TIMER_DEFAULT,
  TIMER_URGENT_SECONDS,
  TIMER_WARNING_SECONDS,
} from '@/features/session-builder/constants/practice-ui'
import { usePracticeTimer } from '@/features/session-builder/hooks/usePracticeTimer'
import { sessionQuestionsToQuizQuestions } from '@/features/session-builder/utils/questions'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'
import type { TypeStats } from '@/features/quiz/types'
import { cn } from '@/lib/utils'

interface PracticeSessionProps {
  questions: SessionQuestion[]
  onComplete: (attempts: SessionAttempt[]) => void
  onBack: () => void
}

export function PracticeSession({ questions, onComplete, onBack }: PracticeSessionProps) {
  const quizQuestions = sessionQuestionsToQuizQuestions(questions)
  const [showCompletion, setShowCompletion] = useState(false)
  const sessionAttempts = useRef<SessionAttempt[]>([])
  const completionStats = useRef<{
    correctCount: number
    totalCount: number
    typeStats: TypeStats
  } | null>(null)
  const retryFn = useRef<(() => void) | null>(null)

  const timer = usePracticeTimer({
    totalSeconds: PRACTICE_TIMER_DEFAULT,
    onTimeUp: () => {
      if (!showCompletion) {
        onComplete(sessionAttempts.current)
      }
    },
    autoStart: true,
  })

  const handleQuizComplete = useCallback(
    (result: {
      correctCount: number
      totalCount: number
      typeStats: TypeStats
      retryIncorrect: () => void
    }) => {
      timer.pause()
      sessionAttempts.current = []
      completionStats.current = {
        correctCount: result.correctCount,
        totalCount: result.totalCount,
        typeStats: result.typeStats,
      }
      retryFn.current = result.retryIncorrect
      setShowCompletion(true)
    },
    [timer],
  )

  const handleRetryIncorrect = useCallback(() => {
    retryFn.current?.()
    timer.reset()
    setShowCompletion(false)
  }, [timer])

  const timerUrgent = timer.timeLeft < TIMER_URGENT_SECONDS
  const timerWarning = timer.timeLeft < TIMER_WARNING_SECONDS

  if (showCompletion && completionStats.current) {
    const { correctCount, totalCount, typeStats } = completionStats.current

    return (
      <CompletionScreen
        correctCount={correctCount}
        totalCount={totalCount}
        typeStats={typeStats}
        timeTaken={PRACTICE_TIMER_DEFAULT - timer.timeLeft}
        onRetryIncorrect={handleRetryIncorrect}
        onBack={() => {
          timer.reset()
          setShowCompletion(false)
          onBack()
        }}
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

        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-mono font-bold transition-all',
            timerUrgent && 'animate-pulse',
          )}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            background: timerUrgent
              ? 'rgba(255,77,109,0.15)'
              : timerWarning
                ? 'rgba(251,191,36,0.1)'
                : 'rgba(255,255,255,0.05)',
            color: timerUrgent ? '#ff4d6d' : timerWarning ? '#fbbf24' : '#6b6b8a',
            border: `1px solid ${
              timerUrgent
                ? 'rgba(255,77,109,0.3)'
                : timerWarning
                  ? 'rgba(251,191,36,0.2)'
                  : 'rgba(255,255,255,0.08)'
            }`,
          }}
        >
          <Clock className='w-3.5 h-3.5' />
          <span>
            {Math.floor(timer.timeLeft / 60)
              .toString()
              .padStart(2, '0')}
            :{(timer.timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <QuizEngine
        initialQuestions={quizQuestions}
        onComplete={handleQuizComplete}
      />
    </div>
  )
}
