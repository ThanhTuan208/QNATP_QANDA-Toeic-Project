import { INITIAL_WIZARD_STATE } from '@/features/session-builder/constants'
import type { SessionBuilderAction, SessionBuilderState } from '@/features/session-builder/types'
import { calculateTotalQuestions, getPresetConfig } from '@/features/session-builder/utils/presets'
import { getNextStep, getPrevStep } from '@/features/session-builder/utils/steps'

export function sessionBuilderReducer(
  state: SessionBuilderState,
  action: SessionBuilderAction,
): SessionBuilderState {
  switch (action.type) {
    case 'SET_SCOPE': {
      const filteredQuestions = state.questions.filter((q) => action.scope.parts.includes(q.part))
      const partsRemoved = filteredQuestions.length < state.questions.length
      const newParts = action.scope.parts

      const config =
        state.preset && state.preset !== 'custom'
          ? { ...getPresetConfig(newParts, state.preset), parts: newParts }
          : (() => {
              const oldKg = state.config.knowledgeGroups ?? {}
              const newKg: Record<number, (typeof oldKg)[number]> = {}
              for (const [partStr, groups] of Object.entries(oldKg)) {
                if (newParts.includes(Number(partStr))) {
                  newKg[Number(partStr)] = groups
                }
              }
              return {
                ...state.config,
                parts: newParts,
                knowledgeGroups: newKg,
                totalQuestions: calculateTotalQuestions(newKg),
              }
            })()

      return {
        ...state,
        scope: { parts: newParts },
        config,
        questions: filteredQuestions,
        validationErrors:
          partsRemoved && state.source === 'imported'
            ? ['Các part đã thay đổi. Vui lòng kiểm tra lại dữ liệu import trước khi tiếp tục.']
            : [],
      }
    }
    case 'SET_PRESET': {
      const partial = getPresetConfig(state.scope.parts, action.preset)
      return {
        ...state,
        preset: action.preset,
        config:
          action.preset === 'custom'
            ? { ...state.config, parts: state.scope.parts }
            : { ...partial, parts: state.scope.parts },
        validationErrors: [],
      }
    }
    case 'SET_CONFIG':
      return { ...state, config: action.config, validationErrors: [] }
    case 'SET_SOURCE':
      if (action.source === 'system') {
        return { ...state, source: action.source, importJson: '', validationErrors: [] }
      }
      return { ...state, source: action.source }
    case 'SET_IMPORT_JSON':
      return { ...state, importJson: action.importJson }
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.errors }
    case 'SET_QUESTIONS':
      return { ...state, questions: action.questions }
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.isGenerating }
    case 'SET_GENERATION_ERROR':
      return { ...state, generationError: action.error }
    case 'SET_PRACTICE_MODE':
      return { ...state, practiceMode: action.mode }
    case 'NEXT_STEP': {
      const next = getNextStep(state.step)
      if (!next) return state
      return { ...state, step: next }
    }
    case 'PREV_STEP': {
      const prev = getPrevStep(state.step)
      if (!prev) return state
      return { ...state, step: prev }
    }
    case 'RESET':
      return { ...INITIAL_WIZARD_STATE }
  }
}
