import type { SessionQuestion } from '@/features/temp-session/types'
import { GRADE_THRESHOLDS } from '../constants/practice-ui'

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function getGradeInfo(pct: number): {
  grade: string
  label: string
  color: string
} {
  for (const t of GRADE_THRESHOLDS) {
    if (pct >= t.min) return { grade: t.grade, label: t.label, color: t.color }
  }
  return { grade: 'D', label: 'Thử lại nhé!', color: 'var(--color-quiz-error)' }
}

export function computeScore(
  questions: SessionQuestion[],
  answers: Record<string, string>,
): number {
  return questions.reduce((sum, q) => {
    if (answers[q.tempId] === q.correctOptionId) return sum + 100
    return sum
  }, 0)
}

export function countResults(
  questions: SessionQuestion[],
  answers: Record<string, string>,
): { correct: number; wrong: number; skipped: number } {
  let correct = 0
  let wrong = 0
  let skipped = 0
  for (const q of questions) {
    const ans = answers[q.tempId]
    if (!ans) skipped++
    else if (ans === q.correctOptionId) correct++
    else wrong++
  }
  return { correct, wrong, skipped }
}
