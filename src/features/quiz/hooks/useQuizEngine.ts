'use client'

import { useCallback, useMemo } from 'react'
import { useQuizAttempt } from '@/features/quiz/hooks/useQuizAttempt'
import { useQuizImport } from '@/features/quiz/hooks/useQuizImport'
import { useQuizQuestions } from '@/features/quiz/hooks/useQuizQuestions'
import type { AttemptRecord, AttemptResult, Question, TypeStats } from '@/features/quiz/types'

interface UseQuizEngineOptions {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
  onStatsUpdate?: (total: number, correct: number) => void
}

interface UseQuizEngineReturn {
  currentQuestion: Question | null
  questions: Question[]
  selectedOptionId: string | null
  submitting: boolean
  result: AttemptResult | null
  correctCount: number
  typeStats: TypeStats
  attemptHistory: AttemptRecord[]
  currentIdx: number
  totalQuestions: number
  isLoading: boolean
  isComplete: boolean
  isEmpty: boolean
  showImport: boolean
  importJson: string
  importError: string
  promptText: string
  handleSelect: (optionId: string) => void
  handleNext: () => void
  handleOpenImport: () => void
  handleSubmitImport: () => void
  setImportJson: (value: string) => void
  closeImport: () => void
  reset: () => void
  retryIncorrect: () => void
  incorrectCount: number
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

  const incorrectCount = useMemo(
    () => attemptHook.attemptHistory.filter((a) => !a.isCorrect).length,
    [attemptHook.attemptHistory],
  )

  const handleNext = useCallback(() => {
    attemptHook.clearAnswer()
    questionsHook.advanceQuestion()
  }, [attemptHook.clearAnswer, questionsHook.advanceQuestion])

  const reset = useCallback(() => {
    questionsHook.resetIdx()
    attemptHook.clearAnswer()
    options.onStatsUpdate?.(0, 0)
  }, [questionsHook.resetIdx, attemptHook.clearAnswer, options.onStatsUpdate])

  const retryIncorrect = useCallback(() => {
    const incorrectIds = new Set(
      attemptHook.attemptHistory.filter((a) => !a.isCorrect).map((a) => a.questionId),
    )
    const incorrectQuestions = questionsHook.questions.filter((q) => incorrectIds.has(q.id))
    if (incorrectQuestions.length === 0) return

    attemptHook.resetSession()
    questionsHook.setQuestions(incorrectQuestions)
    questionsHook.resetIdx()
    options.onStatsUpdate?.(0, 0)
  }, [
    attemptHook.attemptHistory,
    attemptHook.resetSession,
    questionsHook.questions,
    questionsHook.setQuestions,
    questionsHook.resetIdx,
    options.onStatsUpdate,
  ])

  return {
    currentQuestion: questionsHook.currentQuestion,
    questions: questionsHook.questions,
    selectedOptionId: attemptHook.selectedOptionId,
    submitting: attemptHook.submitting,
    result: attemptHook.result,
    correctCount: attemptHook.correctCount,
    typeStats: attemptHook.typeStats,
    attemptHistory: attemptHook.attemptHistory,
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
    retryIncorrect,
    incorrectCount,
  }
}
