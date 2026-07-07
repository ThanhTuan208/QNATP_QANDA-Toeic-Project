'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchQuestions } from '@/features/quiz/client/quiz.client'
import type { Question } from '@/features/quiz/types'

interface UseQuizQuestionsOptions {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
}

interface UseQuizQuestionsReturn {
  questions: Question[]
  currentQuestion: Question | null
  currentIdx: number
  totalQuestions: number
  isLoading: boolean
  isEmpty: boolean
  isComplete: boolean
  setQuestions: (questions: Question[]) => void
  advanceQuestion: () => void
  resetIdx: () => void
}

export function useQuizQuestions(options: UseQuizQuestionsOptions): UseQuizQuestionsReturn {
  const [questions, setQuestions] = useState<Question[]>(options.initialQuestions ?? [])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(!options.initialQuestions)

  useEffect(() => {
    if (options.initialQuestions) return
    setIsLoading(true)
    fetchQuestions({ type: options.type, difficulty: options.difficulty })
      .then((data) => setQuestions(data.questions))
      .catch(() => setQuestions([]))
      .finally(() => setIsLoading(false))
  }, [options.type, options.difficulty, options.initialQuestions])

  const advanceQuestion = useCallback(() => {
    setCurrentIdx((i) => i + 1)
  }, [])

  const resetIdx = useCallback(() => {
    setCurrentIdx(0)
  }, [])

  const currentQuestion = questions[currentIdx] ?? null
  const totalQuestions = questions.length
  const isEmpty = questions.length === 0 && !isLoading
  const isComplete = currentIdx >= questions.length && questions.length > 0

  return {
    questions,
    currentQuestion,
    currentIdx,
    totalQuestions,
    isLoading,
    isEmpty,
    isComplete,
    setQuestions,
    advanceQuestion,
    resetIdx,
  }
}
