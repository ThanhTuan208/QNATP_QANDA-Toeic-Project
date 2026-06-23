import { NextResponse } from 'next/server'
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

export async function GET() {
  const userId = await getUserId()

  const [totalAttempts, correctAttempts, allAttempts, recentAttempts] = await Promise.all([
    prisma.attempt.count({ where: { userId } }),
    prisma.attempt.count({
      where: { userId, isCorrect: true },
    }),
    prisma.attempt.findMany({
      where: { userId },
      select: {
        isCorrect: true,
        question: { select: { type: true } },
      },
    }),
    prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        question: {
          select: { type: true, difficulty: true },
        },
      },
    }),
  ])

  const typeMap = new Map<string, { total: number; correct: number }>()
  for (const a of allAttempts) {
    const key = a.question.type
    const entry = typeMap.get(key) ?? { total: 0, correct: 0 }
    entry.total++
    if (a.isCorrect) entry.correct++
    typeMap.set(key, entry)
  }

  return NextResponse.json({
    totalAttempts,
    correctAttempts,
    accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
    typeStats: Object.fromEntries(typeMap),
    recentAttempts,
  })
}
