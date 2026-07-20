'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { QuestionCardOption } from '@/features/quiz/types/question-card'

interface UseViewingOptionOptions {
  correctOptionId: string | null
  disabled?: boolean
  onSelect: (optionId: string) => void
  options: QuestionCardOption[]
}

interface UseViewingOptionReturn {
  viewingOptionId: string | null
  viewingOption: QuestionCardOption | null
  handleOptionClick: (optionId: string) => void
}

export function useViewingOption({
  correctOptionId,
  disabled,
  onSelect,
  options,
}: UseViewingOptionOptions): UseViewingOptionReturn {
  const [viewingOptionId, setViewingOptionId] = useState<string | null>(correctOptionId)
  const prevCorrectRef = useRef(correctOptionId)

  useEffect(() => {
    if (prevCorrectRef.current === null && correctOptionId !== null) {
      prevCorrectRef.current = correctOptionId
      return
    }
    if (correctOptionId !== prevCorrectRef.current) {
      prevCorrectRef.current = correctOptionId
      setViewingOptionId(correctOptionId)
    }
  }, [correctOptionId])

  const handleOptionClick = useCallback(
    (optionId: string) => {
      if (correctOptionId === null && !disabled) {
        onSelect(optionId)
      }
      setViewingOptionId(optionId)
    },
    [correctOptionId, onSelect, disabled],
  )

  const viewingOption = viewingOptionId
    ? options.find((o) => o.id === viewingOptionId) ?? null
    : null

  return { viewingOptionId, viewingOption, handleOptionClick }
}
