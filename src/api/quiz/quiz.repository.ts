import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function findQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      options: true,
    },
  })
}

export async function findQuestions(where: Prisma.QuestionWhereInput) {
  return prisma.question.findMany({
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
  })
}

export async function findQuestionsPaginated(
  where: Prisma.QuestionWhereInput,
  take: number,
  skip: number,
) {
  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: {
        options: {
          orderBy: { order: 'asc' },
          select: { id: true, text: true, order: true },
        },
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.question.count({ where }),
  ])
  return { questions, total }
}

export interface CreateAttemptInput {
  userId: string
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  timeSpentSeconds: number
}

export async function createAttempt(data: CreateAttemptInput) {
  const [attempt] = await prisma.$transaction([
    prisma.attempt.create({
      data: {
        userId: data.userId,
        questionId: data.questionId,
        selectedOptionId: data.selectedOptionId,
        isCorrect: data.isCorrect,
        timeSpentSeconds: data.timeSpentSeconds,
      },
    }),
    prisma.question.update({
      where: { id: data.questionId },
      data: { timesUsed: { increment: 1 } },
    }),
  ])
  return attempt
}

export async function countAttempts(userId: string) {
  return prisma.attempt.count({ where: { userId } })
}

export async function countCorrectAttempts(userId: string) {
  return prisma.attempt.count({
    where: { userId, isCorrect: true },
  })
}

export async function findAllAttempts(userId: string) {
  return prisma.attempt.findMany({
    where: { userId },
    select: {
      isCorrect: true,
      question: { select: { type: true } },
    },
  })
}

export async function findRecentAttempts(userId: string) {
  return prisma.attempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      question: {
        select: { type: true, difficulty: true },
      },
    },
  })
}
