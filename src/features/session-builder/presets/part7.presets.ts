import { P7_GROUP, PASSAGE_FORMAT } from '@/features/session-builder/constants/knowledge-groups'
import { PART } from '@/features/session-builder/constants/part'
import { definePreset } from './preset.utils'

export const P7_BALANCED = definePreset({
  id: 'p7-balanced',
  part: PART.P7,
  title: 'Balanced',
  description: 'Balanced mix of reading skills',
  difficulty: 'medium',
  icon: 'scale',
  distribution: [
    { type: P7_GROUP.MAIN_IDEA, count: 6 },
    { type: P7_GROUP.DETAIL, count: 12 },
    { type: P7_GROUP.INFERENCE, count: 12 },
    { type: P7_GROUP.VOCABULARY, count: 4 },
    { type: P7_GROUP.REFERENCE, count: 4 },
    { type: P7_GROUP.INTENTION, count: 6 },
    { type: P7_GROUP.NOT_QUESTION, count: 4 },
    { type: P7_GROUP.NEXT_STEP, count: 4 },
  ],
})

export const P7_DETAIL_HEAVY = definePreset({
  id: 'p7-detail-heavy',
  part: PART.P7,
  title: 'Detail Focus',
  description: 'Emphasis on detail-oriented questions',
  difficulty: 'easy',
  icon: 'search',
  distribution: [
    { type: P7_GROUP.MAIN_IDEA, count: 4 },
    { type: P7_GROUP.DETAIL, count: 20 },
    { type: P7_GROUP.INFERENCE, count: 6 },
    { type: P7_GROUP.VOCABULARY, count: 4 },
    { type: P7_GROUP.REFERENCE, count: 4 },
    { type: P7_GROUP.INTENTION, count: 4 },
    { type: P7_GROUP.NOT_QUESTION, count: 4 },
    { type: P7_GROUP.NEXT_STEP, count: 2 },
  ],
})

export const P7_INFERENCE_HEAVY = definePreset({
  id: 'p7-inference-heavy',
  part: PART.P7,
  title: 'Inference Focus',
  description: 'Emphasis on inference and main idea questions',
  difficulty: 'hard',
  icon: 'brain',
  distribution: [
    { type: P7_GROUP.MAIN_IDEA, count: 8 },
    { type: P7_GROUP.DETAIL, count: 6 },
    { type: P7_GROUP.INFERENCE, count: 18 },
    { type: P7_GROUP.VOCABULARY, count: 4 },
    { type: P7_GROUP.REFERENCE, count: 4 },
    { type: P7_GROUP.INTENTION, count: 6 },
    { type: P7_GROUP.NOT_QUESTION, count: 2 },
    { type: P7_GROUP.NEXT_STEP, count: 4 },
  ],
})

export const P7_SPEED = definePreset({
  id: 'p7-speed',
  part: PART.P7,
  title: 'Speed',
  description: 'Quick reading practice with common question types',
  difficulty: 'easy',
  icon: 'zap',
  distribution: [
    { type: P7_GROUP.MAIN_IDEA, count: 4 },
    { type: P7_GROUP.DETAIL, count: 8 },
    { type: P7_GROUP.INFERENCE, count: 4 },
    { type: P7_GROUP.VOCABULARY, count: 2 },
    { type: P7_GROUP.REFERENCE, count: 2 },
    { type: P7_GROUP.INTENTION, count: 2 },
    { type: P7_GROUP.NOT_QUESTION, count: 2 },
    { type: P7_GROUP.NEXT_STEP, count: 2 },
  ],
})

export const P7_CHALLENGE = definePreset({
  id: 'p7-challenge',
  part: PART.P7,
  title: 'Challenge',
  description: 'Tough inference and vocabulary in context',
  difficulty: 'hard',
  icon: 'target',
  distribution: [
    { type: P7_GROUP.MAIN_IDEA, count: 4 },
    { type: P7_GROUP.DETAIL, count: 6 },
    { type: P7_GROUP.INFERENCE, count: 14 },
    { type: P7_GROUP.VOCABULARY, count: 8 },
    { type: P7_GROUP.REFERENCE, count: 4 },
    { type: P7_GROUP.INTENTION, count: 6 },
    { type: P7_GROUP.NOT_QUESTION, count: 4 },
    { type: P7_GROUP.NEXT_STEP, count: 4 },
  ],
})

export const P7_REFERENCE_DRILL = definePreset({
  id: 'p7-reference-drill',
  part: PART.P7,
  title: 'Reference Drill',
  description: 'Focus on pronoun reference and vocabulary questions',
  difficulty: 'medium',
  icon: 'book-open',
  distribution: [
    { type: P7_GROUP.MAIN_IDEA, count: 2 },
    { type: P7_GROUP.DETAIL, count: 6 },
    { type: P7_GROUP.INFERENCE, count: 6 },
    { type: P7_GROUP.VOCABULARY, count: 10 },
    { type: P7_GROUP.REFERENCE, count: 14 },
    { type: P7_GROUP.INTENTION, count: 4 },
    { type: P7_GROUP.NOT_QUESTION, count: 4 },
    { type: P7_GROUP.NEXT_STEP, count: 2 },
  ],
})

export const PART7_PRESETS = [
  P7_BALANCED,
  P7_DETAIL_HEAVY,
  P7_INFERENCE_HEAVY,
  P7_SPEED,
  P7_CHALLENGE,
  P7_REFERENCE_DRILL,
] as const
