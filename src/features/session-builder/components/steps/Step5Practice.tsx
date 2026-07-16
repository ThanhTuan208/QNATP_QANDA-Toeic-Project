'use client'

import { useEffect } from 'react'
import { PracticeSession } from '@/features/session-builder/components/practice/PracticeSession'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'

const MAX_QUESTIONS = 10

interface Step5PracticeProps {
  questions: SessionQuestion[]
  onBack: () => void
  onComplete: (attempts: SessionAttempt[]) => void
}

export function Step5Practice({ questions, onBack, onComplete }: Step5PracticeProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (questions.length === 0) {
    return (
      <div className='text-center py-12 text-muted-foreground'>
        No questions available. Please go back and configure your session.
      </div>
    )
  }

  const limited = questions.slice(0, MAX_QUESTIONS)
  return <PracticeSession questions={limited} onComplete={onComplete} onBack={onBack} />
}
