'use client'

import { useMutation } from '@tanstack/react-query'
import { useCallback, useReducer, useRef } from 'react'
import { submitAttempt } from '@/features/quiz/client/quiz.client'
import type {
  AttemptResult,
  AttemptState,
  Question,
  UseQuizAttemptOptions,
  UseQuizAttemptReturn,
} from '@/features/quiz/types'

const INITIAL_STATE: AttemptState = {
  phase: 'idle',
  selectedOptionId: null,
  result: null,
  correctCount: 0,
  typeStats: {},
  attemptHistory: [],
}

type AttemptAction =
  | { type: 'SELECT'; optionId: string }
  | {
      type: 'SUBMIT_SUCCESS'
      result: AttemptResult
      questionType: string
      questionId: string
      selectedOptionId: string
    }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'CLEAR' }
  | { type: 'RESET_SESSION' }

function attemptReducer(state: AttemptState, action: AttemptAction): AttemptState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, phase: 'submitting', selectedOptionId: action.optionId }
    case 'SUBMIT_SUCCESS': {
      const increment = action.result.isCorrect ? 1 : 0
      const prev = state.typeStats[action.questionType] ?? { total: 0, correct: 0 }
      return {
        ...state,
        phase: 'answered',
        result: {
          isCorrect: action.result.isCorrect,
          correctOptionId: action.result.correctOptionId,
          rationale: action.result.rationale,
        },
        correctCount: state.correctCount + increment,
        typeStats: {
          ...state.typeStats,
          [action.questionType]: {
            total: prev.total + 1,
            correct: prev.correct + increment,
          },
        },
        attemptHistory: [
          ...state.attemptHistory,
          {
            questionId: action.questionId,
            questionType: action.questionType,
            selectedOptionId: action.selectedOptionId,
            isCorrect: action.result.isCorrect,
            correctOptionId: action.result.correctOptionId,
            rationale: action.result.rationale,
          },
        ],
      }
    }
    case 'SUBMIT_ERROR':
      return { ...state, phase: 'idle', selectedOptionId: null }
    case 'CLEAR':
      return { ...state, phase: 'idle', selectedOptionId: null, result: null }
    case 'RESET_SESSION':
      return { ...INITIAL_STATE }
  }
}

export function useQuizAttempt(options: UseQuizAttemptOptions): UseQuizAttemptReturn {
  const [state, dispatch] = useReducer(attemptReducer, INITIAL_STATE)
  const lastQuestionType = useRef('')
  const lastQuestionId = useRef('')
  const lastSelectedOptionId = useRef('')

  const mutation = useMutation({
    mutationFn: ({
      questionId,
      selectedOptionId,
    }: {
      questionId: string
      selectedOptionId: string
    }) => submitAttempt(questionId, selectedOptionId),
    onSuccess: (data) => {
      dispatch({
        type: 'SUBMIT_SUCCESS',
        result: data,
        questionType: lastQuestionType.current,
        questionId: lastQuestionId.current,
        selectedOptionId: lastSelectedOptionId.current,
      })
      options.onStatsUpdate?.(options.currentIdx + 1, state.correctCount + (data.isCorrect ? 1 : 0))
    },
    onError: () => {
      dispatch({ type: 'SUBMIT_ERROR' })
    },
  })

  function computeLocalResult(question: Question, optionId: string): AttemptResult {
    const correctOpt = question.options.find((o) => o.id === question.correctOptionId)
    return {
      isCorrect: optionId === question.correctOptionId,
      correctOptionId: question.correctOptionId ?? '',
      rationale: correctOpt?.rationale ?? question.rationale ?? '',
    }
  }

  const handleSelect = useCallback(
    (optionId: string) => {
      const question = options.currentQuestion
      if (!question || state.phase !== 'idle') return

      lastQuestionType.current = question.type
      lastQuestionId.current = question.id
      lastSelectedOptionId.current = optionId
      dispatch({ type: 'SELECT', optionId })

      if (question.correctOptionId) {
        const result = computeLocalResult(question, optionId)
        dispatch({
          type: 'SUBMIT_SUCCESS',
          result,
          questionType: question.type,
          questionId: question.id,
          selectedOptionId: optionId,
        })
        options.onStatsUpdate?.(
          options.currentIdx + 1,
          state.correctCount + (result.isCorrect ? 1 : 0),
        )
      } else {
        mutation.mutate({ questionId: question.id, selectedOptionId: optionId })
      }
    },
    [
      options.currentQuestion,
      state.phase,
      state.correctCount,
      mutation.mutate,
      options.onStatsUpdate,
      options.currentIdx,
    ],
  )

  const clearAnswer = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' })
  }, [])

  return {
    selectedOptionId: state.selectedOptionId,
    submitting: state.phase === 'submitting',
    result: state.result,
    correctCount: state.correctCount,
    typeStats: state.typeStats,
    attemptHistory: state.attemptHistory,
    handleSelect,
    clearAnswer,
    resetSession,
  }
}
