import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getUserId(): Promise<string> {
  const session = await auth()
  if (session?.user?.id) return session.user.id

  const dev = await prisma.user.upsert({
    where: { email: 'dev@toeic.local' },
    update: {},
    create: { email: 'dev@toeic.local', name: 'Dev User' },
  })
  return dev.id
}

export async function POST(request: NextRequest) {
  const userId = await getUserId()

  const body = await request.json()
  const { questionId, selectedOptionId, timeSpentSeconds } = body

  if (!questionId || !selectedOptionId) {
    return NextResponse.json(
      { error: 'questionId and selectedOptionId are required' },
      { status: 400 },
    )
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { options: true },
  })

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const selectedOption = question.options.find((opt) => opt.id === selectedOptionId)
  if (!selectedOption) {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId,
      questionId,
      selectedOptionId,
      isCorrect: selectedOption.isCorrect,
      timeSpentSeconds: timeSpentSeconds || 0,
    },
  })

  await prisma.question.update({
    where: { id: questionId },
    data: { timesUsed: { increment: 1 } },
  })

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      isCorrect: attempt.isCorrect,
    },
    correctOptionId: question.options.find((opt) => opt.isCorrect)?.id,
    rationale: selectedOption.rationale,
  })
}
