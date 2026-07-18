'use client'

import { useCallback, useEffect, useReducer } from 'react'
import { INITIAL_WIZARD_STATE, WIZARD_STEPS } from '@/features/session-builder/constants'
import { sessionBuilderReducer } from '@/features/session-builder/hooks/sessionBuilderReducer'
import type { UseSessionBuilderReturn } from '@/features/session-builder/types'
import { canAdvanceFromStep } from '@/features/session-builder/utils/steps'

function getSavedPracticeMode(): 'quiz' | 'list' {
  if (typeof window === 'undefined') return 'quiz'
  const saved = localStorage.getItem('practice-mode')
  if (saved === 'quiz' || saved === 'list') return saved
  return 'quiz'
}

export function useSessionBuilder(): UseSessionBuilderReturn {
  const [state, dispatch] = useReducer(sessionBuilderReducer, {
    ...INITIAL_WIZARD_STATE,
    practiceMode: getSavedPracticeMode(),
  })

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

  const setQuestions = useCallback((questions: (typeof state)['questions']) => {
    dispatch({ type: 'SET_QUESTIONS', questions })
  }, [])

  const setGenerating = useCallback((isGenerating: boolean) => {
    dispatch({ type: 'SET_GENERATING', isGenerating })
  }, [])

  const setGenerationError = useCallback((error: string) => {
    dispatch({ type: 'SET_GENERATION_ERROR', error })
  }, [])

  const setPracticeMode = useCallback((mode: 'quiz' | 'list') => {
    dispatch({ type: 'SET_PRACTICE_MODE', mode })
    try {
      localStorage.setItem('practice-mode', mode)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('practice-mode')
      if (saved === 'quiz' || saved === 'list') {
        dispatch({ type: 'SET_PRACTICE_MODE', mode: saved })
      }
    } catch {}
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const canGoNext = useCallback((): boolean => {
    return canAdvanceFromStep(state)
  }, [state])

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
    setQuestions,
    setGenerating,
    setGenerationError,
    setPracticeMode,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    currentStepIndex,
    totalSteps,
    reset,
  }
}
