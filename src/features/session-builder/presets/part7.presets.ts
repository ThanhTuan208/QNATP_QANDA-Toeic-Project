import { P7_GROUP } from '@/features/session-builder/constants/knowledge-groups'
import { PART } from '@/features/session-builder/constants/part'
import { definePreset } from './preset.utils'

export const P7_BALANCED = definePreset({
  id: 'p7-balanced',
  part: PART.P7,
  title: 'Balanced',
  description: 'Equal distribution across single, double, and triple passages',
  difficulty: 'medium',
  icon: 'scale',
  distribution: [
    { type: P7_GROUP.SINGLE_PASSAGE, count: 18 },
    { type: P7_GROUP.DOUBLE_PASSAGE, count: 18 },
    { type: P7_GROUP.TRIPLE_PASSAGE, count: 18 },
  ],
})

export const P7_SINGLE_HEAVY = definePreset({
  id: 'p7-single-heavy',
  part: PART.P7,
  title: 'Single Passage Focus',
  description: 'Emphasis on single passage comprehension',
  difficulty: 'easy',
  icon: 'file-text',
  distribution: [
    { type: P7_GROUP.SINGLE_PASSAGE, count: 30 },
    { type: P7_GROUP.DOUBLE_PASSAGE, count: 14 },
    { type: P7_GROUP.TRIPLE_PASSAGE, count: 10 },
  ],
})

export const P7_TRIPLE_HEAVY = definePreset({
  id: 'p7-triple-heavy',
  part: PART.P7,
  title: 'Triple Passage Focus',
  description: 'Emphasis on triple passage comprehension',
  difficulty: 'hard',
  icon: 'columns-3',
  distribution: [
    { type: P7_GROUP.SINGLE_PASSAGE, count: 10 },
    { type: P7_GROUP.DOUBLE_PASSAGE, count: 16 },
    { type: P7_GROUP.TRIPLE_PASSAGE, count: 28 },
  ],
})

export const P7_DOUBLE_HEAVY = definePreset({
  id: 'p7-double-heavy',
  part: PART.P7,
  title: 'Double Passage Focus',
  description: 'Emphasis on double passage comprehension',
  difficulty: 'medium',
  icon: 'columns-2',
  distribution: [
    { type: P7_GROUP.SINGLE_PASSAGE, count: 10 },
    { type: P7_GROUP.DOUBLE_PASSAGE, count: 30 },
    { type: P7_GROUP.TRIPLE_PASSAGE, count: 14 },
  ],
})

export const P7_SPEED = definePreset({
  id: 'p7-speed',
  part: PART.P7,
  title: 'Speed',
  description: 'Quick reading practice with fewer passages',
  difficulty: 'easy',
  icon: 'zap',
  distribution: [
    { type: P7_GROUP.SINGLE_PASSAGE, count: 18 },
    { type: P7_GROUP.DOUBLE_PASSAGE, count: 10 },
    { type: P7_GROUP.TRIPLE_PASSAGE, count: 8 },
  ],
})

export const P7_CHALLENGE = definePreset({
  id: 'p7-challenge',
  part: PART.P7,
  title: 'Challenge',
  description: 'Heavy on double and triple passages',
  difficulty: 'hard',
  icon: 'target',
  distribution: [
    { type: P7_GROUP.SINGLE_PASSAGE, count: 8 },
    { type: P7_GROUP.DOUBLE_PASSAGE, count: 20 },
    { type: P7_GROUP.TRIPLE_PASSAGE, count: 26 },
  ],
})

export const PART7_PRESETS = [
  P7_BALANCED,
  P7_SINGLE_HEAVY,
  P7_TRIPLE_HEAVY,
  P7_DOUBLE_HEAVY,
  P7_SPEED,
  P7_CHALLENGE,
] as const
