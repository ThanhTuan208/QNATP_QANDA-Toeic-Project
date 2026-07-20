'use client'

import { useEffect, useMemo, useState } from 'react'
import type { QuestionCardPassage } from '@/features/quiz/types/question-card'

interface UsePart7PassageOptions {
  passage?: QuestionCardPassage
  passages?: QuestionCardPassage[]
  passageId?: string
}

interface UsePart7PassageReturn {
  allPassages: QuestionCardPassage[]
  activePassageIdx: number
  activePassage: QuestionCardPassage | null
  passageContent: string
  setActivePassageIdx: (idx: number) => void
}

export function usePart7Passage({
  passage,
  passages,
  passageId,
}: UsePart7PassageOptions): UsePart7PassageReturn {
  const [activePassageIdx, setActivePassageIdx] = useState(0)

  const allPassages = useMemo(
    () => passages ?? (passage ? [passage] : []),
    [passage, passages],
  )

  // Auto-switch to the passage tab matching passageId
  useEffect(() => {
    if (passageId && allPassages.length > 1) {
      const idx = allPassages.findIndex((p) => p.id === passageId)
      if (idx >= 0) {
        setActivePassageIdx(idx)
      }
    }
  }, [passageId, allPassages])

  const activePassage = allPassages[activePassageIdx] ?? null

  const passageContent = useMemo(() => {
    if (!activePassage) return ''
    if (activePassage.contentBlocks) {
      return activePassage.contentBlocks
        .filter((b) => b.type === 'text')
        .map((b) => b.value)
        .join(' ')
    }
    return activePassage.content ?? ''
  }, [activePassage])

  return {
    allPassages,
    activePassageIdx,
    activePassage,
    passageContent,
    setActivePassageIdx,
  }
}
