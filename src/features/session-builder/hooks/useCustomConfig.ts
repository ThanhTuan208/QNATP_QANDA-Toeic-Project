'use client'

import { useCallback, useMemo } from 'react'
import { DEFAULT_DIFFICULTY, PART_MAX_QUESTIONS } from '@/features/session-builder/constants'
import {
  calculateTotalQuestions,
  setKnowledgeGroupCount,
  toggleDifficulty,
} from '@/features/session-builder/utils/presets'
import type { KnowledgeGroupConfig, SessionConfig } from '@/features/temp-session/types'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'

export function useCustomConfig(
  parts: number[],
  config: Partial<SessionConfig>,
  onConfigChange: (config: Partial<SessionConfig>) => void,
) {
  const knowledgeGroups = config.knowledgeGroups ?? {}
  const difficulties = config.difficulty ?? [DEFAULT_DIFFICULTY]

  const getPartTotal = useCallback(
    (part: number) => {
      return (knowledgeGroups[part] ?? []).reduce((s, g) => s + g.count, 0)
    },
    [knowledgeGroups],
  )

  const clampCount = useCallback(
    (part: number, type: string, count: number) => {
      const partMax = PART_MAX_QUESTIONS[part] ?? 99
      const groups = knowledgeGroups[part] ?? []
      const otherTotal = groups.filter((g) => g.type !== type).reduce((s, g) => s + g.count, 0)
      const maxAllowed = partMax - otherTotal
      return Math.min(count, Math.max(0, maxAllowed))
    },
    [knowledgeGroups],
  )

  const handleDeltaChange = useCallback(
    (part: number, type: string, delta: number) => {
      const currentCount = (knowledgeGroups[part] ?? []).find((g) => g.type === type)?.count ?? 0
      const clamped = clampCount(part, type, currentCount + delta)
      if (clamped === currentCount) return
      const { groups, total } = setKnowledgeGroupCount(knowledgeGroups, part, type, clamped)
      onConfigChange({ ...config, knowledgeGroups: groups, totalQuestions: total })
    },
    [knowledgeGroups, config, onConfigChange, clampCount],
  )

  const handleCountChange = useCallback(
    (part: number, type: string, valueStr: string) => {
      const parsed = parseInt(valueStr, 10)
      const rawCount = Number.isNaN(parsed) || parsed < 0 ? 0 : parsed
      const count = clampCount(part, type, rawCount)
      const { groups, total } = setKnowledgeGroupCount(knowledgeGroups, part, type, count)
      onConfigChange({ ...config, knowledgeGroups: groups, totalQuestions: total })
    },
    [knowledgeGroups, config, onConfigChange, clampCount],
  )

  const applyPreset = useCallback(
    (groups: KnowledgeGroupConfig[], part: number) => {
      const updatedGroups = {
        ...knowledgeGroups,
        [part]: groups,
      }
      onConfigChange({
        ...config,
        knowledgeGroups: updatedGroups,
        totalQuestions: calculateTotalQuestions(updatedGroups),
      })
    },
    [knowledgeGroups, config, onConfigChange],
  )

  const handleDifficultyToggle = useCallback(
    (diff: string) => {
      const updated = toggleDifficulty(difficulties, diff)
      onConfigChange({ ...config, difficulty: updated })
    },
    [difficulties, config, onConfigChange],
  )

  const configIssues = useMemo(() => {
    const issues: { part: number; total: number }[] = []
    for (const part of parts) {
      const hasGroups = getKnowledgeGroupsForPart(part).length > 0
      if (!hasGroups) continue
      const total = (knowledgeGroups[part] ?? []).reduce((s, g) => s + g.count, 0)
      if (total < 5) issues.push({ part, total })
    }
    return issues
  }, [parts, knowledgeGroups])

  const applyAllPresets = useCallback(
    (allGroups: Record<number, KnowledgeGroupConfig[]>) => {
      const merged = { ...knowledgeGroups, ...allGroups }
      onConfigChange({
        ...config,
        knowledgeGroups: merged,
        totalQuestions: calculateTotalQuestions(merged),
      })
    },
    [knowledgeGroups, config, onConfigChange],
  )

  const total = useMemo(() => calculateTotalQuestions(knowledgeGroups), [knowledgeGroups])

  return {
    configIssues,
    knowledgeGroups,
    difficulties,
    total,
    getPartTotal,
    handleDeltaChange,
    handleCountChange,
    applyPreset,
    handleDifficultyToggle,
    applyAllPresets,
  }
}
