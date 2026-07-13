import type { NextRequest } from 'next/server'
import { getRandomQuestions } from '@/api/quiz/quiz.service'
import type { SessionQuestion } from '@/features/temp-session/types'
import { AppError } from '@/lib/errors/AppError'
import { error, success } from '@/lib/response'

interface GenerateRequest {
  parts: number[]
  knowledgeGroups: Record<number, { type: string; count: number }[]>
  difficulty: string[]
  totalQuestions: number
}

function buildTypeToPartMap(
  knowledgeGroups: Record<number, { type: string; count: number }[]>,
): Map<string, number> {
  const map = new Map<string, number>()
  for (const [partStr, groups] of Object.entries(knowledgeGroups)) {
    const part = Number(partStr)
    for (const group of groups) {
      if (!map.has(group.type)) {
        map.set(group.type, part)
      }
    }
  }
  return map
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    if (!body.knowledgeGroups || Object.keys(body.knowledgeGroups).length === 0) {
      return error('Missing knowledgeGroups in config', 400)
    }

    const typeToPart = buildTypeToPartMap(body.knowledgeGroups)
    const types = Array.from(typeToPart.keys())

    const result = await getRandomQuestions({
      types,
      difficulties: body.difficulty,
      limit: body.totalQuestions || 50,
      balance: types.length > 1,
    })

    const questions: SessionQuestion[] = result.questions.map((q) => {
      const correctOption = q.options.find((o: { isCorrect: boolean }) => o.isCorrect)
      return {
        tempId: String(Date.now()) + String(Math.random()).slice(2, 8),
        part: typeToPart.get(q.type.toLowerCase()) ?? 5,
        type: q.type.toLowerCase(),
        difficulty: q.difficulty.toLowerCase(),
        questionText: q.questionText,
        options: q.options.map((o: { id: string; text: string; order: number }) => ({
          id: o.id,
          text: o.text,
          order: o.order,
        })),
        correctOptionId: correctOption?.id ?? '',
        rationale: correctOption?.rationale ?? '',
        originalId: q.id,
      }
    })

    return success({ questions })
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
