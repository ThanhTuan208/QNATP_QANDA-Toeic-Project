'use client'

import { useCallback } from 'react'
import type { AttemptResult, Question } from '../types'
import { useQuizAttempt } from './useQuizAttempt'
import { useQuizImport } from './useQuizImport'
import { useQuizQuestions } from './useQuizQuestions'

interface UseQuizEngineOptions {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
  onStatsUpdate?: (total: number, correct: number) => void
}

interface UseQuizEngineReturn {
  currentQuestion: Question | null
  selectedOptionId: string | null
  submitting: boolean
  result: AttemptResult | null
  correctCount: number
  currentIdx: number
  totalQuestions: number
  isLoading: boolean
  isComplete: boolean
  isEmpty: boolean
  showImport: boolean
  importJson: string
  importError: string
  promptText: string
  handleSelect: (optionId: string) => Promise<void>
  handleNext: () => void
  handleOpenImport: () => void
  handleSubmitImport: () => void
  setImportJson: (value: string) => void
  closeImport: () => void
  reset: () => void
}

export function useQuizEngine(options: UseQuizEngineOptions): UseQuizEngineReturn {
  const questionsHook = useQuizQuestions({
    type: options.type,
    difficulty: options.difficulty,
    initialQuestions: options.initialQuestions,
  })

  const attemptHook = useQuizAttempt({
    currentQuestion: questionsHook.currentQuestion,
    currentIdx: questionsHook.currentIdx,
    onStatsUpdate: options.onStatsUpdate,
  })

  const importHook = useQuizImport({
    type: options.type,
    onImportQuestions: (questions) => {
      questionsHook.setQuestions(questions)
      questionsHook.resetIdx()
      attemptHook.clearAnswer()
      options.onStatsUpdate?.(0, 0)
    },
  })

  const handleNext = useCallback(() => {
    attemptHook.clearAnswer()
    questionsHook.advanceQuestion()
  }, [attemptHook.clearAnswer, questionsHook.advanceQuestion])

  const reset = useCallback(() => {
    questionsHook.resetIdx()
    attemptHook.clearAnswer()
    options.onStatsUpdate?.(0, 0)
  }, [questionsHook.resetIdx, attemptHook.clearAnswer, options.onStatsUpdate])

  return {
    currentQuestion: questionsHook.currentQuestion,
    selectedOptionId: attemptHook.selectedOptionId,
    submitting: attemptHook.submitting,
    result: attemptHook.result,
    correctCount: attemptHook.correctCount,
    currentIdx: questionsHook.currentIdx,
    totalQuestions: questionsHook.totalQuestions,
    isLoading: questionsHook.isLoading,
    isComplete: questionsHook.isComplete,
    isEmpty: questionsHook.isEmpty,
    showImport: importHook.showImport,
    importJson: importHook.importJson,
    importError: importHook.importError,
    promptText: importHook.promptText,
    handleSelect: attemptHook.handleSelect,
    handleNext,
    handleOpenImport: importHook.openImport,
    handleSubmitImport: importHook.submitImport,
    setImportJson: importHook.setImportJson,
    closeImport: importHook.closeImport,
    reset,
  }
}
