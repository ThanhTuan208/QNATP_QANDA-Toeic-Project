import type { NextRequest } from 'next/server'
import { listQuestions } from '@/api/quiz/quiz.service'
import { AppError } from '@/lib/errors/AppError'
import { error, paginated } from '@/lib/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const result = await listQuestions({
      type: searchParams.get('type'),
      difficulty: searchParams.get('difficulty'),
      limit: Math.min(Number(searchParams.get('limit')) || 20, 50),
      offset: Number(searchParams.get('offset')) || 0,
    })

    return paginated(result.questions, result.total, 1, result.questions.length)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
