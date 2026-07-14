'use client'

import { useCallback } from 'react'
import { generateSessionQuestions } from '@/features/session-builder/client/session.client'
import type { SessionBuilderState } from '@/features/session-builder/types'
import { processImportedSessionJSON } from '@/features/session-builder/utils/validation'

interface UseQuestionGenerationActions {
  setQuestions: (questions: SessionBuilderState['questions']) => void
  setGenerating: (isGenerating: boolean) => void
  setGenerationError: (error: string) => void
  nextStep: () => void
}

export function useQuestionGeneration(
  state: SessionBuilderState,
  actions: UseQuestionGenerationActions,
) {
  const handleNext = useCallback(async () => {
    if (state.step !== 'source') {
      actions.nextStep()
      return
    }

    if (state.source === 'imported' && state.importJson) {
      const result = processImportedSessionJSON(state.importJson, state.config)
      if (result.success) {
        actions.setQuestions(result.questions)
      }
      actions.nextStep()
      return
    }

    if (state.source === 'system') {
      actions.setGenerating(true)
      actions.setGenerationError('')
      try {
        const { scope, config } = state
        const { questions } = await generateSessionQuestions({
          parts: scope.parts,
          knowledgeGroups: config.knowledgeGroups ?? {},
          difficulty: config.difficulty ?? ['medium'],
          totalQuestions: config.totalQuestions ?? 20,
        })
        actions.setQuestions(questions)
        actions.setGenerating(false)
        actions.nextStep()
      } catch (e) {
        actions.setGenerating(false)
        actions.setGenerationError(
          e instanceof Error ? e.message : 'Unknown error generating questions',
        )
      }
    }
  }, [actions, state])

  return { handleNext }
}
