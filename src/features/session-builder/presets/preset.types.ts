import type {
  P5KnowledgeGroup,
  P6KnowledgeGroup,
  P7KnowledgeGroup,
} from '@/features/session-builder/constants/knowledge-groups'
import type { PART, Part } from '@/features/session-builder/constants/part'

export type DistributionItem<T> = {
  type: T
  count: number
}

export const PRESET_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const

export type PresetDifficulty = (typeof PRESET_DIFFICULTY)[keyof typeof PRESET_DIFFICULTY]

export type PartPreset<TKnowledgeGroup, TPart extends Part = Part> = {
  id: string
  part: TPart
  title: string
  description?: string
  difficulty?: PresetDifficulty
  icon?: string
  distribution: readonly DistributionItem<TKnowledgeGroup>[]
}

export type Part5Preset = PartPreset<P5KnowledgeGroup, typeof PART.P5>
export type Part6Preset = PartPreset<P6KnowledgeGroup, typeof PART.P6>
export type Part7Preset = PartPreset<P7KnowledgeGroup, typeof PART.P7>

export type AnyPartPreset = Part5Preset | Part6Preset | Part7Preset
