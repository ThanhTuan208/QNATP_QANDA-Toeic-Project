import type { NextRequest } from 'next/server'
import { getRandomQuestions } from '@/api/quiz/quiz.service'
import { AppError } from '@/lib/errors/AppError'
import { error, success } from '@/lib/response'

const MAX_LIMIT = 50

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const result = await getRandomQuestions({
      type: searchParams.get('type'),
      difficulty: searchParams.get('difficulty'),
      types: searchParams.getAll('types'),
      difficulties: searchParams.getAll('difficulties'),
      limit: Math.min(Number(searchParams.get('limit')) || 20, MAX_LIMIT),
      balance: searchParams.get('balance') === 'true',
    })

    return success(result)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
