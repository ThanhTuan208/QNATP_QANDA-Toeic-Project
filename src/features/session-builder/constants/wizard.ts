import type { SessionBuilderState } from '@/features/session-builder/types'

export const INITIAL_WIZARD_STATE: SessionBuilderState = {
  step: 'scope',
  scope: { parts: [5, 6, 7] },
  preset: null,
  config: {},
  source: 'system',
  importJson: '',
  validationErrors: [],
  questions: [],
  isGenerating: false,
  generationError: '',
}
