import type { SessionQuestion } from '@/features/temp-session/types'

export interface QuestionStats {
  byPart: Record<number, number>
  byDifficulty: Record<string, number>
}

export function computeQuestionStats(questions: SessionQuestion[]): QuestionStats {
  const byPart: Record<number, number> = {}
  const byDifficulty: Record<string, number> = {}
  for (const q of questions) {
    byPart[q.part] = (byPart[q.part] ?? 0) + 1
    const normalized = q.difficulty.toUpperCase()
    byDifficulty[normalized] = (byDifficulty[normalized] ?? 0) + 1
  }
  return { byPart, byDifficulty }
}
