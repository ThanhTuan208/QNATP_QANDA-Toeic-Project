import { P6_GROUP } from '@/features/session-builder/constants/knowledge-groups'
import { PART } from '@/features/session-builder/constants/part'
import { definePreset } from './preset.utils'

export const P6_BALANCED = definePreset({
  id: 'p6-balanced',
  part: PART.P6,
  title: 'Balanced',
  description: 'Equal distribution across sentence insertion, grammar, vocabulary, and transition',
  difficulty: 'medium',
  icon: 'scale',
  distribution: [
    { type: P6_GROUP.SENTENCE_INSERTION, count: 4 },
    { type: P6_GROUP.GRAMMAR, count: 4 },
    { type: P6_GROUP.VOCABULARY, count: 4 },
    { type: P6_GROUP.TRANSITION, count: 4 },
  ],
})

export const P6_GRAMMAR_HEAVY = definePreset({
  id: 'p6-grammar-heavy',
  part: PART.P6,
  title: 'Grammar Heavy',
  description: 'Focus on sentence insertion and grammar',
  difficulty: 'hard',
  icon: 'sigma',
  distribution: [
    { type: P6_GROUP.SENTENCE_INSERTION, count: 4 },
    { type: P6_GROUP.GRAMMAR, count: 6 },
    { type: P6_GROUP.VOCABULARY, count: 3 },
    { type: P6_GROUP.TRANSITION, count: 3 },
  ],
})

export const P6_VOCAB_FOCUSED = definePreset({
  id: 'p6-vocab-focused',
  part: PART.P6,
  title: 'Vocab Focused',
  description: 'Emphasis on vocabulary in context',
  difficulty: 'medium',
  icon: 'book-open',
  distribution: [
    { type: P6_GROUP.SENTENCE_INSERTION, count: 2 },
    { type: P6_GROUP.GRAMMAR, count: 3 },
    { type: P6_GROUP.VOCABULARY, count: 7 },
    { type: P6_GROUP.TRANSITION, count: 2 },
  ],
})

export const P6_INSERTION_DRILL = definePreset({
  id: 'p6-insertion-drill',
  part: PART.P6,
  title: 'Insertion Drill',
  description: 'Focus on sentence insertion questions',
  difficulty: 'hard',
  icon: 'between-vert-end',
  distribution: [
    { type: P6_GROUP.SENTENCE_INSERTION, count: 6 },
    { type: P6_GROUP.GRAMMAR, count: 3 },
    { type: P6_GROUP.VOCABULARY, count: 2 },
    { type: P6_GROUP.TRANSITION, count: 3 },
  ],
})

export const P6_SPEED = definePreset({
  id: 'p6-speed',
  part: PART.P6,
  title: 'Speed',
  description: 'Quick text completion practice',
  difficulty: 'easy',
  icon: 'zap',
  distribution: [
    { type: P6_GROUP.SENTENCE_INSERTION, count: 2 },
    { type: P6_GROUP.GRAMMAR, count: 2 },
    { type: P6_GROUP.VOCABULARY, count: 2 },
    { type: P6_GROUP.TRANSITION, count: 2 },
  ],
})

export const PART6_PRESETS = [
  P6_BALANCED,
  P6_GRAMMAR_HEAVY,
  P6_VOCAB_FOCUSED,
  P6_INSERTION_DRILL,
  P6_SPEED,
] as const
