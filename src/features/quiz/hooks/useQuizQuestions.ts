'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { fetchQuestions, fetchWeightedQuestions } from '@/features/quiz/client/quiz.client'
import type {
  FetchQuestionsResponse,
  Question,
  UseQuizQuestionsOptions,
  UseQuizQuestionsReturn,
} from '@/features/quiz/types'

export function useQuizQuestions(options: UseQuizQuestionsOptions): UseQuizQuestionsReturn {
  const queryClient = useQueryClient()
  const [currentIdx, setCurrentIdx] = useState(0)

  const { data, isLoading } = useQuery<FetchQuestionsResponse>({
    enabled: !options.initialQuestions,
    queryKey: [
      'questions',
      options.type,
      options.difficulty,
      options.weighted ? 'weighted' : 'random',
    ],
    queryFn: () => {
      if (options.weighted) {
        return fetchWeightedQuestions({
          types: options.types,
          difficulties: options.difficulties,
          limit: 10,
        })
      }
      return fetchQuestions({ type: options.type, difficulty: options.difficulty })
    },
    initialData: options.initialQuestions
      ? { questions: options.initialQuestions, total: options.initialQuestions.length }
      : undefined,
  })

  const questions = data?.questions ?? []
  const setQuestions = useCallback(
    (questions: Question[]) => {
      queryClient.setQueryData(
        ['questions', options.type, options.difficulty, options.weighted ? 'weighted' : 'random'],
        { questions },
      )
    },
    [queryClient, options.type, options.difficulty, options.weighted],
  )

  const advanceQuestion = useCallback(() => {
    setCurrentIdx((i) => i + 1)
  }, [])

  const resetIdx = useCallback(() => {
    setCurrentIdx(0)
  }, [])

  const goToQuestion = useCallback((index: number) => {
    setCurrentIdx(index)
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
    goToQuestion,
  }
}
