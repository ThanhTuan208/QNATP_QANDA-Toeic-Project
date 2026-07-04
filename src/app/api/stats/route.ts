import { getUserStats } from '@/api/quiz/quiz.service'
import { getUserId } from '@/lib/auth-utils'
import { AppError } from '@/lib/errors/AppError'
import { error, success } from '@/lib/response'

export async function GET() {
  try {
    const userId = await getUserId()
    const stats = await getUserStats(userId)
    return success(stats)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
