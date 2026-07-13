export const KNOWLEDGE_GROUPS: Record<number, { type: string; label: string }[]> = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [
    { type: 'word-form', label: 'Word Form' },
    { type: 'comparison', label: 'Comparison' },
    { type: 'vocabulary', label: 'Vocabulary' },
    { type: 'verb-tense', label: 'Verb Tense' },
    { type: 'preposition', label: 'Preposition' },
    { type: 'conjunction', label: 'Conjunction' },
    { type: 'participle', label: 'Participle' },
    { type: 'voice', label: 'Voice' },
    { type: 'relative-clause', label: 'Relative Clause' },
    { type: 'agreement', label: 'Agreement' },
  ],
  6: [
    { type: 'sentence-insertion', label: 'Sentence Insertion' },
    { type: 'grammar', label: 'Grammar' },
    { type: 'vocabulary', label: 'Vocabulary' },
  ],
  7: [
    { type: 'single-passage', label: 'Single Passage' },
    { type: 'double-passage', label: 'Double Passage' },
    { type: 'triple-passage', label: 'Triple Passage' },
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

export const PART_GROUPS: Record<string, number[]> = {
  reading: [5, 6, 7],
  listening: [1, 2, 3, 4],
}
