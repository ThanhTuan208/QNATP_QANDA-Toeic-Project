import type { PresetType, SessionBuilderStep } from '@/features/session-builder/types'
import type { SessionConfig } from '@/features/temp-session/types'

export interface ScopeConfig {
  parts: number[]
}

export interface SessionBuilderState {
  step: SessionBuilderStep
  scope: ScopeConfig
  preset: PresetType
  config: Partial<SessionConfig>
  source: 'system' | 'imported'
  importJson: string
  validationErrors: string[]
}

export type SessionBuilderAction =
  | { type: 'SET_SCOPE'; scope: ScopeConfig }
  | { type: 'SET_PRESET'; preset: PresetType }
  | { type: 'SET_CONFIG'; config: Partial<SessionConfig> }
  | { type: 'SET_SOURCE'; source: 'system' | 'imported' }
  | { type: 'SET_IMPORT_JSON'; importJson: string }
  | { type: 'SET_VALIDATION_ERRORS'; errors: string[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' }

export interface UseSessionBuilderReturn {
  state: SessionBuilderState
  setScope: (scope: ScopeConfig) => void
  setPreset: (preset: PresetType) => void
  setConfig: (config: Partial<SessionConfig>) => void
  setSource: (source: 'system' | 'imported') => void
  setImportJson: (json: string) => void
  setValidationErrors: (errors: string[]) => void
  nextStep: () => void
  prevStep: () => void
  canGoNext: () => boolean
  canGoPrev: () => boolean
  currentStepIndex: () => number
  totalSteps: () => number
  reset: () => void
}
