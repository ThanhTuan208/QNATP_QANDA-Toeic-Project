'use client'

import { useCallback, useRef, useState } from 'react'
import type { Question, TypeStats } from '@/features/quiz/types'
import { usePracticeTimer } from '@/features/session-builder/hooks/usePracticeTimer'
import { sessionQuestionsToQuizQuestions } from '@/features/session-builder/utils/questions'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'

interface UsePracticeEngineOptions {
  questions: SessionQuestion[]
  timeLimit?: number
  onComplete: (attempts: SessionAttempt[]) => void
  onBack: () => void
}

interface QuizCompleteResult {
  correctCount: number
  totalCount: number
  typeStats: TypeStats
  retryIncorrect: () => void
}

interface CompletionData {
  correctCount: number
  totalCount: number
  typeStats: TypeStats
  retryIncorrect: () => void
}

interface UsePracticeEngineReturn {
  quizQuestions: Question[]
  hasTimeLimit: boolean
  timeUp: boolean
  timeLeft: number
  showCompletion: boolean
  completionData: {
    correctCount: number
    totalCount: number
    typeStats: TypeStats
    timeTaken: number
    onRetryIncorrect: () => void
    onBack: () => void
  } | null
  onQuizComplete: (result: QuizCompleteResult) => void
}

export function usePracticeEngine({
  questions,
  timeLimit,
  onComplete,
  onBack,
}: UsePracticeEngineOptions): UsePracticeEngineReturn {
  const quizQuestions = sessionQuestionsToQuizQuestions(questions)
  const [timeUp, setTimeUp] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const sessionAttempts = useRef<SessionAttempt[]>([])
  const completionRef = useRef<CompletionData | null>(null)
  const hasTimeLimit = !!timeLimit

  const timer = usePracticeTimer({
    totalSeconds: hasTimeLimit ? timeLimit * 60 : 0,
    onTimeUp: () => setTimeUp(true),
    autoStart: true,
    countUp: !hasTimeLimit,
  })

  const onQuizComplete = useCallback(
    (result: QuizCompleteResult) => {
      timer.pause()
      completionRef.current = {
        correctCount: result.correctCount,
        totalCount: result.totalCount,
        typeStats: result.typeStats,
        retryIncorrect: result.retryIncorrect,
      }
      onComplete(sessionAttempts.current)
      setShowCompletion(true)
    },
    [timer, onComplete],
  )

  const timeTaken = hasTimeLimit ? timeLimit * 60 - timer.timeLeft : timer.timeLeft

  const completionData =
    showCompletion && completionRef.current
      ? {
          correctCount: completionRef.current.correctCount,
          totalCount: completionRef.current.totalCount,
          typeStats: completionRef.current.typeStats,
          timeTaken,
          onRetryIncorrect: () => {
            const fn = completionRef.current!.retryIncorrect
            fn()
            timer.reset()
            setShowCompletion(false)
          },
          onBack: () => {
            timer.reset()
            setShowCompletion(false)
            onBack()
          },
        }
      : null

  return {
    quizQuestions,
    hasTimeLimit,
    timeUp,
    timeLeft: timer.timeLeft,
    showCompletion,
    completionData,
    onQuizComplete,
  }
}
