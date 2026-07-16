'use client'

import { useEffect, useRef, useState } from 'react'
import type { SessionQuestion } from '@/features/temp-session/types'

export function useStep4Preview(
  questions: SessionQuestion[],
  onQuestionsChange?: (questions: SessionQuestion[]) => void,
) {
  const [showAnswers, setShowAnswers] = useState(false)
  const [showCorrect, setShowCorrect] = useState(false)
  const [localQuestions, setLocalQuestions] = useState<SessionQuestion[]>(questions)
  const [shuffled, setShuffled] = useState(false)
  const originalRef = useRef(questions)
  const removedRef = useRef<Set<string>>(new Set())
  const isInternalRef = useRef(false)

  useEffect(() => {
    if (isInternalRef.current) {
      isInternalRef.current = false
      return
    }
    originalRef.current = questions
    setLocalQuestions(questions)
    setShuffled(false)
    removedRef.current = new Set()
  }, [questions])

  const shuffle = () => {
    isInternalRef.current = true
    const copy = [...localQuestions]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    setLocalQuestions(copy)
    setShuffled(true)
    onQuestionsChange?.(copy)
  }

  const resetOrder = () => {
    isInternalRef.current = true
    const original = originalRef.current
    setLocalQuestions(original)
    setShuffled(false)
    onQuestionsChange?.(original)
  }

  const removeQuestion = (tempId: string) => {
    isInternalRef.current = true
    removedRef.current = new Set(removedRef.current).add(tempId)
    const filtered = localQuestions.filter((q) => q.tempId !== tempId)
    setLocalQuestions(filtered)
    onQuestionsChange?.(filtered)
  }

  const restoreAll = () => {
    isInternalRef.current = true
    removedRef.current = new Set()
    const original = originalRef.current
    setLocalQuestions(original)
    setShuffled(false)
    onQuestionsChange?.(original)
  }

  return {
    showAnswers,
    setShowAnswers,
    showCorrect,
    setShowCorrect,
    localQuestions,
    shuffled,
    shuffle,
    resetOrder,
    removeQuestion,
    restoreAll,
  }
}
