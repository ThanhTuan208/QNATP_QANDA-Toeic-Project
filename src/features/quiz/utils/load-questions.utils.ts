import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface LoadedQuestion {
  id: string
  questionText: string
  type: string
  difficulty: string
  hint: string | null
  options: Array<{
    id: string
    text: string
    order: number
  }>
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export async function loadQuestions(
  type?: string | null,
  limit?: number,
): Promise<LoadedQuestion[]> {
  try {
    const filePath = join(process.cwd(), 'data', 'questions.json')
    const raw = await readFile(filePath, 'utf-8')
    const all: Array<{
      question: string
      type: string
      difficulty: string
      options: Array<{ text: string; isCorrect: boolean; rationale: string }>
      hint?: string
      code: string
    }> = JSON.parse(raw)
    const filtered = type ? all.filter((q) => q.type === type) : all
    const selected = shuffle(filtered).slice(0, limit)
    return selected.map((q) => ({
      id: q.code,
      questionText: q.question,
      type: q.type,
      difficulty: q.difficulty,
      hint: q.hint ?? null,
      options: q.options.map((o, idx) => ({
        id: `${q.code}_${idx}`,
        text: o.text,
        order: idx,
      })),
    }))
  } catch {
    return []
  }
}
