import type { KnowledgeGroupConfig } from '@/features/temp-session/types'

export interface PartPreset {
  id: string
  name: string
  part: number
  groups: KnowledgeGroupConfig[]
}

export const SYSTEM_PRESETS: PartPreset[] = [
  {
    id: 'p5-balanced',
    name: 'Balanced',
    part: 5,
    groups: [
      { type: 'word-form', count: 3 },
      { type: 'comparison', count: 3 },
      { type: 'vocabulary', count: 3 },
      { type: 'verb-tense', count: 3 },
      { type: 'preposition', count: 3 },
      { type: 'conjunction', count: 3 },
      { type: 'participle', count: 3 },
      { type: 'voice', count: 3 },
      { type: 'relative-clause', count: 3 },
      { type: 'agreement', count: 3 },
    ],
  },
  {
    id: 'p5-grammar-heavy',
    name: 'Grammar Heavy',
    part: 5,
    groups: [
      { type: 'word-form', count: 6 },
      { type: 'comparison', count: 2 },
      { type: 'vocabulary', count: 4 },
      { type: 'verb-tense', count: 4 },
      { type: 'preposition', count: 3 },
      { type: 'conjunction', count: 3 },
      { type: 'participle', count: 2 },
      { type: 'voice', count: 2 },
      { type: 'relative-clause', count: 2 },
      { type: 'agreement', count: 2 },
    ],
  },
  {
    id: 'p5-vocab-focused',
    name: 'Vocab Focused',
    part: 5,
    groups: [
      { type: 'word-form', count: 8 },
      { type: 'comparison', count: 2 },
      { type: 'vocabulary', count: 8 },
      { type: 'verb-tense', count: 2 },
      { type: 'preposition', count: 3 },
      { type: 'conjunction', count: 2 },
      { type: 'participle', count: 1 },
      { type: 'voice', count: 1 },
      { type: 'relative-clause', count: 1 },
      { type: 'agreement', count: 2 },
    ],
  },
  {
    id: 'p6-balanced',
    name: 'Balanced',
    part: 6,
    groups: [
      { type: 'sentence-insertion', count: 6 },
      { type: 'grammar', count: 5 },
      { type: 'vocabulary', count: 5 },
    ],
  },
  {
    id: 'p6-grammar-heavy',
    name: 'Grammar Heavy',
    part: 6,
    groups: [
      { type: 'sentence-insertion', count: 4 },
      { type: 'grammar', count: 8 },
      { type: 'vocabulary', count: 4 },
    ],
  },
  {
    id: 'p7-balanced',
    name: 'Balanced',
    part: 7,
    groups: [
      { type: 'single-passage', count: 18 },
      { type: 'double-passage', count: 18 },
      { type: 'triple-passage', count: 18 },
    ],
  },
  {
    id: 'p7-single-heavy',
    name: 'Single Passage Focus',
    part: 7,
    groups: [
      { type: 'single-passage', count: 30 },
      { type: 'double-passage', count: 14 },
      { type: 'triple-passage', count: 10 },
    ],
  },
  {
    id: 'p7-triple-heavy',
    name: 'Triple Passage Focus',
    part: 7,
    groups: [
      { type: 'single-passage', count: 10 },
      { type: 'double-passage', count: 16 },
      { type: 'triple-passage', count: 28 },
    ],
  },
]
