import * as quizRepo from '@/api/quiz/quiz.repository'
import { AppError } from '@/lib/errors/AppError'

export async function submitAttempt(
  input: { questionId: string; selectedOptionId: string; timeSpentSeconds?: number },
  userId: string,
) {
  const question = await quizRepo.findQuestionById(input.questionId)
  if (!question) throw AppError.notFound('Question')

  const selectedOption = question.options.find((o) => o.id === input.selectedOptionId)
  if (!selectedOption) throw AppError.validation('Invalid option')

  const attempt = await quizRepo.createAttempt({
    userId,
    questionId: input.questionId,
    selectedOptionId: input.selectedOptionId,
    isCorrect: selectedOption.isCorrect,
    timeSpentSeconds: input.timeSpentSeconds ?? 0,
  })

  const correctOptionId = question.options.find((o) => o.isCorrect)?.id

  return {
    attempt: { id: attempt.id, isCorrect: attempt.isCorrect },
    correctOptionId,
    rationale: selectedOption.rationale,
  }
}

export async function listQuestions(params: {
  type?: string | null
  difficulty?: string | null
  limit?: number
  offset?: number
}) {
  const where: Record<string, unknown> = { isActive: true }
  if (params.type) where.type = params.type
  if (params.difficulty) where.difficulty = params.difficulty

  return quizRepo.findQuestionsPaginated(where, params.limit ?? 20, params.offset ?? 0)
}

export async function getRandomQuestions(params: {
  type?: string | null
  difficulty?: string | null
  limit?: number
}) {
  const where: Record<string, unknown> = { isActive: true }
  if (params.type) where.type = params.type
  if (params.difficulty) where.difficulty = params.difficulty

  const questions = await quizRepo.findQuestions(where)

  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[questions[i], questions[j]] = [questions[j], questions[i]]
  }

  return {
    questions: questions.slice(0, params.limit ?? 20),
    total: questions.length,
  }
}

export async function getUserStats(userId: string) {
  const [totalAttempts, correctAttempts, allAttempts, recentAttempts] = await Promise.all([
    quizRepo.countAttempts(userId),
    quizRepo.countCorrectAttempts(userId),
    quizRepo.findAllAttempts(userId),
    quizRepo.findRecentAttempts(userId),
  ])

  const typeMap = new Map<string, { total: number; correct: number }>()
  for (const a of allAttempts) {
    const key = a.question.type
    const entry = typeMap.get(key) ?? { total: 0, correct: 0 }
    entry.total++
    if (a.isCorrect) entry.correct++
    typeMap.set(key, entry)
  }

  return {
    totalAttempts,
    correctAttempts,
    accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
    typeStats: Object.fromEntries(typeMap),
    recentAttempts,
  }
}
