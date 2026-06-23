import type { Prisma } from '@prisma/client'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const difficulty = searchParams.get('difficulty')
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50)

  const where: Prisma.QuestionWhereInput = {
    isActive: true,
    ...(type && { type: type as any }),
    ...(difficulty && { difficulty: difficulty as any }),
  }

  const questions = await prisma.question.findMany({
    where,
    include: {
      options: {
        orderBy: { order: 'asc' },
        select: { id: true, text: true, order: true },
      },
    },
  })

  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]]
  }

  const sliced = questions.slice(0, limit)

  return NextResponse.json({ questions: sliced, total: questions.length })
}
