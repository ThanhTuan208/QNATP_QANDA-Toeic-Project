import type { NextRequest } from 'next/server'
import { submitAttempt } from '@/api/quiz/quiz.service'
import { getUserId } from '@/lib/auth-utils'
import { AppError } from '@/lib/errors/AppError'
import { error, success } from '@/lib/response'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const body = await request.json()
    const result = await submitAttempt(body, userId)
    return success(result)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('Internal server error', 500)
  }
}
