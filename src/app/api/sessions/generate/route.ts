import type { NextRequest } from 'next/server'
import { getRandomQuestions } from '@/api/quiz/quiz.service'
import { AppError } from '@/lib/errors/AppError'
import { error, success } from '@/lib/response'
import { buildTypeToPartMap, dbQuestionsToSessionQuestions } from '@/features/session-builder/utils/questions'

interface GenerateRequest {
  parts: number[]
  knowledgeGroups: Record<number, { type: string; count: number }[]>
  difficulty: string[]
  totalQuestions: number
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

    const questions = dbQuestionsToSessionQuestions(result.questions, typeToPart)

    return success({ questions })
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
