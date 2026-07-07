import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TYPE_LABEL_MAP: Record<string, string> = {
  'word-form': 'Word Form (Từ loại)',
  comparison: 'So Sánh Hơn',
  vocabulary: 'Vocabulary & Collocation',
  'verb-tense': 'Verb Tense (Thì)',
  preposition: 'Prepositions (Giới từ)',
  conjunction: 'Conjunctions (Liên từ)',
  participle: 'Participles (Phân từ)',
  voice: 'Passive Voice & Causative',
  'relative-clause': 'Relative Clauses',
  agreement: 'Subject-Verb Agreement',
}

export function formatAccuracy(correct: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((correct / total) * 100)}%`
}
