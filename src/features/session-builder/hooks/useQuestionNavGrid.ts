'use client'

import { useMemo } from 'react'
import type { Question } from '@/features/quiz/types'

interface UseQuestionNavGridOptions {
  questions: Question[]
  currentIndex: number
}

interface PartGroup {
  part: number
  startIndex: number
  count: number
}

export function useQuestionNavGrid({ questions, currentIndex }: UseQuestionNavGridOptions) {
  const { groups, passageGroupToIndices, currentPassageGroupId } = useMemo(() => {
    const partMap = new Map<number, PartGroup>()
    const pgMap = new Map<string, number[]>()

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const part = q.part ?? 0
      const existing = partMap.get(part)
      if (existing) {
        existing.count++
      } else {
        partMap.set(part, { part, startIndex: i, count: 1 })
      }
      if (q.passageGroupId) {
        const list = pgMap.get(q.passageGroupId)
        if (list) list.push(i)
        else pgMap.set(q.passageGroupId, [i])
      }
    }

    const currentQ = questions[currentIndex]
    const currentPgId = currentQ?.passageGroupId ?? null

    return {
      groups: Array.from(partMap.values()).sort((a, b) => a.startIndex - b.startIndex),
      passageGroupToIndices: pgMap,
      currentPassageGroupId: currentPgId,
    }
  }, [questions, currentIndex])

  const currentPart = questions[currentIndex]?.part ?? 0

  const activePassageIndices = useMemo(() => {
    if (currentPart !== 7 || !currentPassageGroupId) return new Set<number>()
    const all = passageGroupToIndices.get(currentPassageGroupId) ?? []
    return new Set(all.filter((i) => (questions[i]?.part ?? 0) === currentPart))
  }, [currentPassageGroupId, passageGroupToIndices, currentPart, questions])

  return {
    groups,
    currentPart,
    activePassageIndices,
  }
}
