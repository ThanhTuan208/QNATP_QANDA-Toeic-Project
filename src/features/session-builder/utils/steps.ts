import { KNOWLEDGE_GROUPS, WIZARD_STEPS } from '@/features/session-builder/constants'
import type { SessionBuilderState, SessionBuilderStep } from '@/features/session-builder/types'

export function getNextStep(current: SessionBuilderStep): SessionBuilderStep | null {
  const idx = WIZARD_STEPS.indexOf(current)
  return idx < WIZARD_STEPS.length - 1 ? WIZARD_STEPS[idx + 1] : null
}

export function getPrevStep(current: SessionBuilderStep): SessionBuilderStep | null {
  const idx = WIZARD_STEPS.indexOf(current)
  return idx > 0 ? WIZARD_STEPS[idx - 1] : null
}

export function canAdvanceFromStep(state: SessionBuilderState): boolean {
  if (state.isGenerating) return false
  switch (state.step) {
    case 'scope':
      return state.scope.parts.length > 0
    case 'config': {
      if (state.config.totalQuestions == null) return false
      if (state.preset !== 'custom') return state.config.totalQuestions >= 5
      const kg = state.config.knowledgeGroups ?? {}
      return state.scope.parts
        .filter((part) => KNOWLEDGE_GROUPS[part].length > 0)
        .every((part) => {
          const totalPart = (kg[part] ?? []).reduce((sum, n) => sum + n.count, 0)
          return totalPart >= 5
        })
    }
    case 'source':
      return (
        state.source === 'system' ||
        (state.importJson.length > 0 && state.validationErrors.length === 0)
      )
    case 'preview':
      return state.questions.length > 0
    case 'practice':
      return false
  }
}
