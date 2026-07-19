'use client'

import { useCallback, useRef, useState } from 'react'
import type { TypeStats } from '@/features/quiz/types'

interface CompletionData {
  correctCount: number
  totalCount: number
  typeStats: TypeStats
  retryIncorrect: () => void
}

interface UsePracticeCompletionReturn {
  showCompletion: boolean
  completionData: CompletionData | null
  handleComplete: (data: CompletionData, onSave: () => void) => void
  handleRetry: (onRetry: () => void) => void
  handleBack: (onBack: () => void, onReset: () => void) => void
}

export function usePracticeCompletion(): UsePracticeCompletionReturn {
  const [showCompletion, setShowCompletion] = useState(false)
  const completionRef = useRef<CompletionData | null>(null)

  const handleComplete = useCallback((data: CompletionData, onSave: () => void) => {
    completionRef.current = data
    onSave()
    setShowCompletion(true)
  }, [])

  const handleRetry = useCallback((onRetry: () => void) => {
    onRetry()
    setShowCompletion(false)
  }, [])

  const handleBack = useCallback((onBack: () => void, onReset: () => void) => {
    onReset()
    setShowCompletion(false)
    onBack()
  }, [])

  return {
    showCompletion,
    completionData: completionRef.current,
    handleComplete,
    handleRetry,
    handleBack,
  }
}
