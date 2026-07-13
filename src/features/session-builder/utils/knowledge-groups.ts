import { KNOWLEDGE_GROUPS } from '@/features/session-builder/constants'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'

export function getKnowledgeGroupsForPart(part: number): { type: string; label: string }[] {
  return KNOWLEDGE_GROUPS[part] ?? []
}

export function getDefaultKnowledgeGroups(parts: number[]): Record<number, KnowledgeGroupConfig[]> {
  const result: Record<number, KnowledgeGroupConfig[]> = {}
  for (const part of parts) {
    const groups = getKnowledgeGroupsForPart(part)
    if (groups.length > 0) {
      result[part] = groups.map((g) => ({ type: g.type, count: 1 }))
    }
  }
  return result
}

export function getKnowledgeGroupLabel(part: number, type: string): string {
  const groups = KNOWLEDGE_GROUPS[part] ?? []
  return groups.find((g) => g.type === type)?.label ?? type
}

export function togglePartSelection(currentParts: number[], part: number): number[] {
  const updated = currentParts.includes(part)
    ? currentParts.filter((p) => p !== part)
    : [...currentParts, part]
  return updated.sort()
}
