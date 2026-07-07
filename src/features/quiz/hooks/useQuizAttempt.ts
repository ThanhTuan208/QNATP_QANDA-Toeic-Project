'use client'

import { useMutation } from '@tanstack/react-query'
import { useCallback, useReducer } from 'react'
import { submitAttempt } from '@/features/quiz/client/quiz.client'
import type {
  AttemptResult,
  AttemptState,
  UseQuizAttemptOptions,
  UseQuizAttemptReturn,
} from '@/features/quiz/types'

const INITIAL_STATE: AttemptState = {
  phase: 'idle',
  selectedOptionId: null,
  result: null,
  correctCount: 0,
}

type AttemptAction =
  | { type: 'SELECT'; optionId: string }
  | { type: 'SUBMIT_SUCCESS'; result: AttemptResult }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'CLEAR' }

function attemptReducer(state: AttemptState, action: AttemptAction): AttemptState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, phase: 'submitting', selectedOptionId: action.optionId }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        phase: 'answered',
        result: {
          isCorrect: action.result.isCorrect,
          correctOptionId: action.result.correctOptionId,
          rationale: action.result.rationale,
        },
        correctCount: state.correctCount + (action.result.isCorrect ? 1 : 0),
      }
    case 'SUBMIT_ERROR':
      return { ...state, phase: 'idle', selectedOptionId: null }
    case 'CLEAR':
      return { ...state, phase: 'idle', selectedOptionId: null, result: null }
  }
}

export function useQuizAttempt(options: UseQuizAttemptOptions): UseQuizAttemptReturn {
  const [state, dispatch] = useReducer(attemptReducer, INITIAL_STATE)

  const mutation = useMutation({
    mutationFn: ({
      questionId,
      selectedOptionId,
    }: {
      questionId: string
      selectedOptionId: string
    }) => submitAttempt(questionId, selectedOptionId),
    onSuccess: (data) => {
      dispatch({ type: 'SUBMIT_SUCCESS', result: data })
      options.onStatsUpdate?.(options.currentIdx + 1, state.correctCount + (data.isCorrect ? 1 : 0))
    },
    onError: () => {
      dispatch({ type: 'SUBMIT_ERROR' })
    },
  })

  const handleSelect = useCallback(
    (optionId: string) => {
      const question = options.currentQuestion
      if (!question || state.phase !== 'idle') return

      dispatch({ type: 'SELECT', optionId })
      mutation.mutate({ questionId: question.id, selectedOptionId: optionId })
    },
    [options.currentQuestion, state.phase, mutation.mutate],
  )

  const clearAnswer = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  return {
    selectedOptionId: state.selectedOptionId,
    submitting: state.phase === 'submitting',
    result: state.result,
    correctCount: state.correctCount,
    handleSelect,
    clearAnswer,
  }
}
