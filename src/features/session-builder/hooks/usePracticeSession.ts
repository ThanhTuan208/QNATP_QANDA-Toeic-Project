'use client'

import { useCallback, useEffect } from 'react'
import type { SessionBuilderState } from '@/features/session-builder/types'
import { buildPracticeSession } from '@/features/session-builder/utils/questions'
import type { PracticeSession, SessionAttempt } from '@/features/temp-session/types'

export interface UsePracticeSessionActions {
  save: (session: PracticeSession) => Promise<void>
  getAll: () => Promise<PracticeSession[]>
  updateAttempt: (attempt: SessionAttempt) => Promise<void>
  updateIndex: (index: number) => Promise<void>
}

export function usePracticeSession(
  state: SessionBuilderState,
  nextStep: () => void,
  actions: UsePracticeSessionActions,
  setHidden: (hidden: boolean) => void,
) {
  useEffect(() => {
    if (state.step === 'practice') {
      const timer = setTimeout(() => setHidden(true), 350)
      return () => {
        clearTimeout(timer)
        setHidden(false)
      }
    }
    setHidden(false)
  }, [state.step, setHidden])

  const handleStartPractice = useCallback(async () => {
    if (state.questions.length === 0) return

    const sessionId = crypto.randomUUID()
    const partial = buildPracticeSession({ ...state })
    const session: PracticeSession = { ...partial, id: sessionId, userId: 'anonymous' }
    await actions.save(session)

    nextStep()
  }, [actions, nextStep, state])

  const handlePracticeComplete = useCallback(
    async (attempts: SessionAttempt[]) => {
      const allSessions = await actions.getAll()
      const currentSession = allSessions.find(
        (s) => s.config.source === state.source && s.status === 'active',
      )
      if (currentSession) {
        for (const attempt of attempts) {
          await actions.updateAttempt(attempt)
        }
        await actions.updateIndex(attempts.length)
      }
    },
    [actions, state.source],
  )

  return { handleStartPractice, handlePracticeComplete }
}
