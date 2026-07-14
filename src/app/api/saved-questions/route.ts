import { getUserId } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { error, success } from '@/lib/response'

export async function GET() {
  try {
    const userId = await getUserId()

    const saved = await prisma.savedQuestion.findMany({
      where: { userId },
      select: { questionId: true },
    })

    return success(saved.map((s) => s.questionId))
  } catch {
    return error('Internal server error', 500)
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId()

    const { questionId } = (await request.json()) as { questionId: string }
    if (!questionId) return error('Missing questionId', 400)

    const existing = await prisma.savedQuestion.findUnique({
      where: { userId_questionId: { userId, questionId } },
    })

    if (existing) {
      await prisma.savedQuestion.delete({ where: { id: existing.id } })
      return success({ saved: false, questionId })
    }

    await prisma.savedQuestion.create({
      data: { userId, questionId },
    })

    return success({ saved: true, questionId })
  } catch {
    return error('Internal server error', 500)
  }
}
