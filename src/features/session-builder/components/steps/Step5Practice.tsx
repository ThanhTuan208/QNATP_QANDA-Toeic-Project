'use client'

import { PracticeSession } from '@/features/session-builder/components/practice/PracticeSession'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'

interface Step5PracticeProps {
  questions: SessionQuestion[]
  onBack: () => void
  onComplete: (attempts: SessionAttempt[]) => void
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
