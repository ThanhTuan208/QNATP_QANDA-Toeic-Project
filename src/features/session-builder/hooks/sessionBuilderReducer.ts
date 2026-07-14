import { INITIAL_WIZARD_STATE } from '@/features/session-builder/constants'
import type { SessionBuilderAction, SessionBuilderState } from '@/features/session-builder/types'
import { getPresetConfig } from '@/features/session-builder/utils/presets'
import { getNextStep, getPrevStep } from '@/features/session-builder/utils/steps'

export function sessionBuilderReducer(
  state: SessionBuilderState,
  action: SessionBuilderAction,
): SessionBuilderState {
  switch (action.type) {
    case 'SET_SCOPE':
      return { ...state, scope: action.scope, validationErrors: [] }
    case 'SET_PRESET': {
      const partial = getPresetConfig(state.scope.parts, action.preset)
      return {
        ...state,
        preset: action.preset,
        config: partial,
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
    case 'NEXT_STEP': {
      const next = getNextStep(state.step)
      if (!next) return state
      return { ...state, step: next, validationErrors: [] }
    }
    case 'PREV_STEP': {
      const prev = getPrevStep(state.step)
      if (!prev) return state
      return { ...state, step: prev, validationErrors: [] }
    }
    case 'RESET':
      return { ...INITIAL_WIZARD_STATE }
  }
}
