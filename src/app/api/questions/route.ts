import type { Prisma } from '@prisma/client'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const difficulty = searchParams.get('difficulty')
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50)
  const offset = Number(searchParams.get('offset')) || 0

  const where: Prisma.QuestionWhereInput = {
    isActive: true,
    ...(type && { type: type as any }),
    ...(difficulty && { difficulty: difficulty as any }),
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: {
        options: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            text: true,
            order: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.question.count({ where }),
  ])

  return NextResponse.json({ questions, total, limit, offset })
}
