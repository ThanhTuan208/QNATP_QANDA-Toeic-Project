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

export async function loadQuestions(type: string): Promise<LoadedQuestion[]> {
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
    return all
      .filter((q) => q.type === type)
      .map((q) => ({
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
