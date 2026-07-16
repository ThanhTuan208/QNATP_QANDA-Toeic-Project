import { DEFAULT_DIFFICULTY } from '@/features/session-builder/constants'
import type { SessionBuilderState } from '@/features/session-builder/types'

export const INITIAL_WIZARD_STATE: SessionBuilderState = {
  step: 'scope',
  scope: { parts: [5, 6, 7] },
  preset: null,
  config: { timeLimit: 30, parts: [5, 6, 7], difficulty: [DEFAULT_DIFFICULTY] },
  source: 'system',
  importJson: '',
  validationErrors: [],
  questions: [],
  isGenerating: false,
  generationError: '',
}
