'use client'

import { useCallback, useReducer } from 'react'
import { WIZARD_STEPS } from '@/features/session-builder/constants'
import {
  INITIAL_WIZARD_STATE,
  sessionBuilderReducer,
} from '@/features/session-builder/hooks/sessionBuilderReducer'
import type { UseSessionBuilderReturn } from '@/features/session-builder/types'

export function useSessionBuilder(): UseSessionBuilderReturn {
  const [state, dispatch] = useReducer(sessionBuilderReducer, INITIAL_WIZARD_STATE)

  const setScope = useCallback((scope: (typeof state)['scope']) => {
    dispatch({ type: 'SET_SCOPE', scope })
  }, [])

  const setPreset = useCallback((preset: (typeof state)['preset']) => {
    dispatch({ type: 'SET_PRESET', preset })
  }, [])

  const setConfig = useCallback((config: (typeof state)['config']) => {
    dispatch({ type: 'SET_CONFIG', config })
  }, [])

  const setSource = useCallback((source: (typeof state)['source']) => {
    dispatch({ type: 'SET_SOURCE', source })
  }, [])

  const setImportJson = useCallback((importJson: string) => {
    dispatch({ type: 'SET_IMPORT_JSON', importJson })
  }, [])

  const setValidationErrors = useCallback((errors: string[]) => {
    dispatch({ type: 'SET_VALIDATION_ERRORS', errors })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const canGoNext = useCallback((): boolean => {
    switch (state.step) {
      case 'scope':
        return state.scope.parts.length > 0
      case 'config':
        return state.config.totalQuestions != null && state.config.totalQuestions > 0
      case 'source':
        return (
          state.source === 'system' ||
          (state.importJson.length > 0 && state.validationErrors.length === 0)
        )
      case 'preview':
        return state.validationErrors.length === 0
      case 'practice':
        return false
    }
  }, [
    state.step,
    state.scope.parts,
    state.config.totalQuestions,
    state.source,
    state.importJson,
    state.validationErrors.length,
  ])

  const canGoPrev = useCallback((): boolean => {
    return state.step !== 'scope'
  }, [state.step])

  const currentStepIndex = useCallback((): number => {
    return WIZARD_STEPS.indexOf(state.step)
  }, [state.step])

  const totalSteps = useCallback((): number => {
    return WIZARD_STEPS.length
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    state,
    setScope,
    setPreset,
    setConfig,
    setSource,
    setImportJson,
    setValidationErrors,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    currentStepIndex,
    totalSteps,
    reset,
  }
}
