'use client'

import {
  DisplayModeSelector,
  ListPracticeView,
  PracticeSession,
} from '@/features/session-builder/components/practice'
import { useStep5Practice } from '@/features/session-builder/hooks/useStep5Practice'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session/types'

interface Step5PracticeProps {
  questions: SessionQuestion[]
  practiceMode: 'quiz' | 'list'
  timeLimit?: number
  onPracticeModeChange: (mode: 'quiz' | 'list') => void
  onBack: () => void
  onComplete: (attempts: SessionAttempt[]) => void
}

export function Step5Practice({
  questions,
  practiceMode,
  timeLimit,
  onPracticeModeChange,
  onBack,
  onComplete,
}: Step5PracticeProps) {
  const { showFirstTimeModal, setShowFirstTimeModal } = useStep5Practice()

  if (questions.length === 0) {
    return (
      <div className='text-center py-12 text-muted-foreground'>
        No questions available. Please go back and configure your session.
      </div>
    )
  }

  return (
    <div className='relative'>
      <DisplayModeSelector
        open={showFirstTimeModal}
        onConfirm={(mode) => {
          onPracticeModeChange(mode)
          setShowFirstTimeModal(false)
        }}
      />

      <div className='space-y-4'>
        {practiceMode === 'list' ? (
          <ListPracticeView questions={questions} onComplete={onComplete} onBack={onBack} />
        ) : (
          <PracticeSession questions={questions} timeLimit={timeLimit} onComplete={onComplete} onBack={onBack} />
        )}
      </div>
    </div>
  )
}
