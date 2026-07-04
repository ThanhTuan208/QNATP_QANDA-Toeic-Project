'use client'

import { useCallback, useReducer } from 'react'
import { submitAttempt } from '@/features/quiz/client/quiz.client'
import type { AttemptResult, Question } from '@/features/quiz/types'

type AttemptPhase = 'idle' | 'submitting' | 'answered'

type AttemptState = {
  phase: AttemptPhase
  selectedOptionId: string | null
  result: AttemptResult | null
  correctCount: number
}

type AttemptAction =
  | { type: 'SELECT'; optionId: string }
  | { type: 'SUBMIT_SUCCESS'; result: AttemptResult }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'CLEAR' }

function attemptReducer(state: AttemptState, action: AttemptAction): AttemptState {
  console.log('Attempt Reducer Action:', action)
  switch (action.type) {
    case 'SELECT':
      return { ...state, phase: 'submitting', selectedOptionId: action.optionId }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        phase: 'answered',
        result: action.result,
        correctCount: state.correctCount + (action.result.isCorrect ? 1 : 0),
      }
    case 'SUBMIT_ERROR':
      return { ...state, phase: 'idle', selectedOptionId: null }
    case 'CLEAR':
      return { ...state, phase: 'idle', selectedOptionId: null, result: null }
  }
}

const INITIAL_STATE: AttemptState = {
  phase: 'idle',
  selectedOptionId: null,
  result: null,
  correctCount: 0,
}

interface UseQuizAttemptOptions {
  currentQuestion: Question | null
  currentIdx: number
  onStatsUpdate?: (total: number, correct: number) => void
}

interface UseQuizAttemptReturn {
  selectedOptionId: string | null
  submitting: boolean
  result: AttemptResult | null
  correctCount: number
  handleSelect: (optionId: string) => Promise<void>
  clearAnswer: () => void
}

export function useQuizAttempt(options: UseQuizAttemptOptions): UseQuizAttemptReturn {
  const [state, dispatch] = useReducer(attemptReducer, INITIAL_STATE)

  const handleSelect = useCallback(
    async (optionId: string) => {
      const question = options.currentQuestion
      if (!question || state.phase !== 'idle') return

      dispatch({ type: 'SELECT', optionId })

      try {
        const data = await submitAttempt(question.id, optionId)
        console.log('data result: ', data)
        const newCorrect = state.correctCount + (data.isCorrect ? 1 : 0)
        dispatch({ type: 'SUBMIT_SUCCESS', result: data })
        options.onStatsUpdate?.(options.currentIdx + 1, newCorrect)
      } catch {
        dispatch({ type: 'SUBMIT_ERROR' })
      }
    },
    [
      options.currentQuestion,
      options.currentIdx,
      state.phase,
      state.correctCount,
      options.onStatsUpdate,
    ],
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
