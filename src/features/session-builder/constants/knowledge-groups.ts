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
  MODAL_VERBS: 'modal-verbs',
  CONDITIONALS: 'conditionals',
  INFINITIVE_GERUND: 'infinitive-gerund',
  PARALLEL_STRUCTURE: 'parallel-structure',
  PRONOUN: 'pronoun',
  DETERMINER_QUANTIFIER: 'determiner-quantifier',
} as const

export type P5KnowledgeGroup = (typeof P5_GROUP)[keyof typeof P5_GROUP]

export const P6_GROUP = {
  SENTENCE_INSERTION: 'sentence-insertion',
  GRAMMAR: 'grammar',
  VOCABULARY: 'vocabulary',
  TRANSITION: 'transition',
} as const

export type P6KnowledgeGroup = (typeof P6_GROUP)[keyof typeof P6_GROUP]

export const P7_GROUP = {
  MAIN_IDEA: 'main-idea',
  DETAIL: 'detail',
  INFERENCE: 'inference',
  VOCABULARY: 'vocabulary-in-context',
  REFERENCE: 'reference',
  INTENTION: 'intention',
  NEXT_STEP: 'next-step',
  NOT_QUESTION: 'not-question',
} as const

export type P7KnowledgeGroup = (typeof P7_GROUP)[keyof typeof P7_GROUP]

export const PASSAGE_FORMAT = {
  SINGLE: 'single',
  DOUBLE: 'double',
  TRIPLE: 'triple',
} as const

export type PassageFormatType = (typeof PASSAGE_FORMAT)[keyof typeof PASSAGE_FORMAT]

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
    { type: P5_GROUP.MODAL_VERBS, label: 'Modal Verbs' },
    { type: P5_GROUP.CONDITIONALS, label: 'Conditionals' },
    { type: P5_GROUP.INFINITIVE_GERUND, label: 'Infinitive & Gerund' },
    { type: P5_GROUP.PARALLEL_STRUCTURE, label: 'Parallel Structure' },
    { type: P5_GROUP.PRONOUN, label: 'Pronoun' },
    { type: P5_GROUP.DETERMINER_QUANTIFIER, label: 'Determiner / Quantifier' },
  ],
  6: [
    { type: P6_GROUP.SENTENCE_INSERTION, label: 'Sentence Insertion' },
    { type: P6_GROUP.GRAMMAR, label: 'Grammar' },
    { type: P6_GROUP.VOCABULARY, label: 'Vocabulary' },
    { type: P6_GROUP.TRANSITION, label: 'Transition / Cohesion' },
  ],
  7: [
    { type: P7_GROUP.MAIN_IDEA, label: 'Main Idea / Purpose' },
    { type: P7_GROUP.DETAIL, label: 'Detail' },
    { type: P7_GROUP.INFERENCE, label: 'Inference' },
    { type: P7_GROUP.VOCABULARY, label: 'Vocabulary in Context' },
    { type: P7_GROUP.REFERENCE, label: 'Reference' },
    { type: P7_GROUP.INTENTION, label: 'Intention / Next Step' },
    { type: P7_GROUP.NOT_QUESTION, label: 'NOT / Exception' },
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
