'use client'

import { useEffect, useState } from 'react'
import type { ScopeConfig } from '@/features/session-builder/types'
import { togglePartSelection } from '@/features/session-builder/utils/knowledge-groups'
import type { SessionQuestion } from '@/features/temp-session/types'

export function useStep1Scope(
  scope: ScopeConfig,
  questions: SessionQuestion[],
  onScopeChange: (scope: ScopeConfig) => void,
) {
  const [pendingPart, setPendingPart] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleToggle = (part: number) => {
    const isRemoving = scope.parts.includes(part)
    if (isRemoving) {
      const partQuestions = questions.filter((q) => q.part === part)
      if (partQuestions.length > 0) {
        setPendingPart(part)
        return
      }
    }
    onScopeChange({ parts: togglePartSelection(scope.parts, part) })
  }

  const handleConfirmRemove = () => {
    if (pendingPart === null) return
    onScopeChange({ parts: togglePartSelection(scope.parts, pendingPart) })
    setPendingPart(null)
  }

  const pendingPartQuestionCount =
    pendingPart !== null ? questions.filter((q) => q.part === pendingPart).length : 0

  const hasSelected = scope.parts.length > 0

  return {
    pendingPart,
    setPendingPart,
    pendingPartQuestionCount,
    hasSelected,
    handleToggle,
    handleConfirmRemove,
  }
}
