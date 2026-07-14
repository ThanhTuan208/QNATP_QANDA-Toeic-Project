import type { PresetType } from '@/features/session-builder/types'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'
import type { KnowledgeGroupConfig, SessionConfig } from '@/features/temp-session/types'

const QUICK_TOTAL = 20
const BALANCED_PER_PART = 10
const EXAM_COUNTS: Record<number, number> = { 5: 30, 6: 16, 7: 54 }

export function getPresetConfig(parts: number[], preset: PresetType): Partial<SessionConfig> {
  switch (preset) {
    case 'quick':
      return getQuickConfig(parts)
    case 'balanced':
      return getBalancedConfig(parts)
    case 'smart':
      return getSmartConfig(parts)
    case 'exam':
      return getExamConfig(parts)
    case 'custom':
      return {}
    default:
      return {}
  }
}

function getQuickConfig(parts: number[]): Partial<SessionConfig> {
  const knowledgeGroups: Record<number, KnowledgeGroupConfig[]> = {}
  const sorted = [...parts].sort()
  const primaryPart = sorted.includes(5) ? 5 : sorted[0]

  if (primaryPart) {
    const groups = getKnowledgeGroupsForPart(primaryPart)
    const countPerGroup = Math.max(1, Math.floor(QUICK_TOTAL / groups.length))
    knowledgeGroups[primaryPart] = groups.map((g) => ({
      type: g.type,
      count: countPerGroup,
    }))
  }

  return {
    preset: 'quick',
    knowledgeGroups,
    difficulty: ['MEDIUM'],
    totalQuestions: QUICK_TOTAL,
  }
}

function getBalancedConfig(parts: number[]): Partial<SessionConfig> {
  const knowledgeGroups: Record<number, KnowledgeGroupConfig[]> = {}

  for (const part of parts) {
    const groups = getKnowledgeGroupsForPart(part)
    if (groups.length > 0) {
      knowledgeGroups[part] = groups.map((g) => ({
        type: g.type,
        count: Math.max(1, Math.floor(BALANCED_PER_PART / groups.length)),
      }))
    }
  }

  const totalQuestions = Object.values(knowledgeGroups).reduce(
    (sum, groups) => sum + groups.reduce((s, g) => s + g.count, 0),
    0,
  )

  return {
    preset: 'balanced',
    knowledgeGroups,
    difficulty: ['EASY', 'MEDIUM', 'HARD'],
    totalQuestions,
  }
}

function getSmartConfig(parts: number[]): Partial<SessionConfig> {
  const knowledgeGroups: Record<number, KnowledgeGroupConfig[]> = {}

  for (const part of parts) {
    const groups = getKnowledgeGroupsForPart(part)
    if (groups.length > 0) {
      knowledgeGroups[part] = groups.map((g) => ({
        type: g.type,
        count: 2,
      }))
    }
  }

  return {
    preset: 'smart',
    knowledgeGroups,
    difficulty: ['EASY', 'MEDIUM', 'HARD'],
    totalQuestions: 20,
  }
}

function getExamConfig(parts: number[]): Partial<SessionConfig> {
  const knowledgeGroups: Record<number, KnowledgeGroupConfig[]> = {}

  for (const part of parts) {
    const count = EXAM_COUNTS[part]
    if (!count) continue
    const groups = getKnowledgeGroupsForPart(part)
    if (groups.length > 0) {
      knowledgeGroups[part] = groups.map((g) => ({
        type: g.type,
        count: Math.max(1, Math.floor(count / groups.length)),
      }))
    }
  }

  const totalQuestions = Object.values(knowledgeGroups).reduce(
    (sum, groups) => sum + groups.reduce((s, g) => s + g.count, 0),
    0,
  )

  return {
    preset: 'exam',
    knowledgeGroups,
    difficulty: ['EASY', 'MEDIUM', 'HARD'],
    totalQuestions,
  }
}

export function calculateTotalQuestions(
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>,
): number {
  return Object.values(knowledgeGroups).reduce(
    (sum, groups) => sum + groups.reduce((s, g) => s + g.count, 0),
    0,
  )
}

export function setKnowledgeGroupCount(
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>,
  part: number,
  type: string,
  count: number,
): { groups: Record<number, KnowledgeGroupConfig[]>; total: number } {
  const current = knowledgeGroups[part] ?? []
  const safeCount = Math.max(0, count)
  const updated: Record<number, KnowledgeGroupConfig[]> = {
    ...knowledgeGroups,
    [part]: current.map((g) => (g.type === type ? { ...g, count: safeCount } : g)),
  }
  if (!current.some((g) => g.type === type)) {
    updated[part] = [...current, { type, count: safeCount }]
  }
  return { groups: updated, total: calculateTotalQuestions(updated) }
}

export function updateKnowledgeGroupCount(
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>,
  part: number,
  type: string,
  delta: number,
): { groups: Record<number, KnowledgeGroupConfig[]>; total: number } {
  const current = knowledgeGroups[part] ?? []
  const updated: Record<number, KnowledgeGroupConfig[]> = {
    ...knowledgeGroups,
    [part]: current.map((g) =>
      g.type === type ? { ...g, count: Math.max(0, g.count + delta) } : g,
    ),
  }
  return { groups: updated, total: calculateTotalQuestions(updated) }
}

export function toggleDifficulty(
  currentDifficulties: string[],
  toggledDifficulty: string,
): string[] {
  const updated = currentDifficulties.includes(toggledDifficulty)
    ? currentDifficulties.filter((d) => d !== toggledDifficulty)
    : [...currentDifficulties, toggledDifficulty]
  return updated.length > 0 ? updated : ['MEDIUM']
}
