import type { NextRequest } from 'next/server'
import { getRandomQuestions } from '@/api/quiz/quiz.service'
import { AppError } from '@/lib/errors/AppError'
import { error, success } from '@/lib/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const result = await getRandomQuestions({
      type: searchParams.get('type'),
      difficulty: searchParams.get('difficulty'),
      limit: Math.min(Number(searchParams.get('limit')) || 20, 50),
    })

    return success(result)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
