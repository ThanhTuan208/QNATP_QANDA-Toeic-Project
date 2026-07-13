import type { NextRequest } from 'next/server'
import { getWeightedQuestions } from '@/api/quiz/quiz.service'
import { getUserId } from '@/lib/auth-utils'
import { AppError } from '@/lib/errors/AppError'
import { error, success } from '@/lib/response'

const MAX_LIMIT = 50

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    const { searchParams } = new URL(request.url)

    const result = await getWeightedQuestions(userId, {
      types: searchParams.getAll('types'),
      difficulties: searchParams.getAll('difficulties'),
      limit: Math.min(Number(searchParams.get('limit')) || 20, MAX_LIMIT),
    })

    return success(result)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
