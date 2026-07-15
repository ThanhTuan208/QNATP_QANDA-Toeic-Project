export const P5_GROUP = {
  WORD_FORM: 'word-form',
  COMPARISON: 'comparison',
  VOCABULARY: 'vocabulary',
  VERB_TENSE: 'verb-tense',
  PREPOSITION: 'preposition',
  CONJUNCTION: 'conjunction',
  PARTICIPLE: 'participle',
  VOICE: 'voice',
  RELATIVE_CLAUSE: 'relative-clause',
  AGREEMENT: 'agreement',
} as const

export type P5KnowledgeGroup = (typeof P5_GROUP)[keyof typeof P5_GROUP]

export const P6_GROUP = {
  SENTENCE_INSERTION: 'sentence-insertion',
  GRAMMAR: 'grammar',
  VOCABULARY: 'vocabulary',
} as const

export type P6KnowledgeGroup = (typeof P6_GROUP)[keyof typeof P6_GROUP]

export const P7_GROUP = {
  SINGLE_PASSAGE: 'single-passage',
  DOUBLE_PASSAGE: 'double-passage',
  TRIPLE_PASSAGE: 'triple-passage',
} as const

export type P7KnowledgeGroup = (typeof P7_GROUP)[keyof typeof P7_GROUP]

export type KnowledgeGroupType = P5KnowledgeGroup | P6KnowledgeGroup | P7KnowledgeGroup

export const KNOWLEDGE_GROUPS: Record<number, { type: string; label: string }[]> = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [
    { type: P5_GROUP.WORD_FORM, label: 'Word Form' },
    { type: P5_GROUP.COMPARISON, label: 'Comparison' },
    { type: P5_GROUP.VOCABULARY, label: 'Vocabulary' },
    { type: P5_GROUP.VERB_TENSE, label: 'Verb Tense' },
    { type: P5_GROUP.PREPOSITION, label: 'Preposition' },
    { type: P5_GROUP.CONJUNCTION, label: 'Conjunction' },
    { type: P5_GROUP.PARTICIPLE, label: 'Participle' },
    { type: P5_GROUP.VOICE, label: 'Voice' },
    { type: P5_GROUP.RELATIVE_CLAUSE, label: 'Relative Clause' },
    { type: P5_GROUP.AGREEMENT, label: 'Agreement' },
  ],
  6: [
    { type: P6_GROUP.SENTENCE_INSERTION, label: 'Sentence Insertion' },
    { type: P6_GROUP.GRAMMAR, label: 'Grammar' },
    { type: P6_GROUP.VOCABULARY, label: 'Vocabulary' },
  ],
  7: [
    { type: P7_GROUP.SINGLE_PASSAGE, label: 'Single Passage' },
    { type: P7_GROUP.DOUBLE_PASSAGE, label: 'Double Passage' },
    { type: P7_GROUP.TRIPLE_PASSAGE, label: 'Triple Passage' },
  ],
}

export const PART_LABELS: Record<number, string> = {
  1: 'Part 1: Photographs',
  2: 'Part 2: Question-Response',
  3: 'Part 3: Conversations',
  4: 'Part 4: Talks',
  5: 'Part 5: Incomplete Sentences',
  6: 'Part 6: Text Completion',
  7: 'Part 7: Reading Comprehension',
}

export const PART_MAX_QUESTIONS: Record<number, number> = {
  5: 30,
  6: 16,
  7: 54,
}

export const PART_GROUPS: Record<string, number[]> = {
  reading: [5, 6, 7],
  listening: [1, 2, 3, 4],
}
