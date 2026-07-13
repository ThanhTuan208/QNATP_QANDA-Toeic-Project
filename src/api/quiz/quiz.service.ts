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
    attempt: { id: attempt.id },
    isCorrect: selectedOption.isCorrect,
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

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export async function getRandomQuestions(params: {
  type?: string | null
  difficulty?: string | null
  types?: string[]
  difficulties?: string[]
  limit?: number
  balance?: boolean
}) {
  const limit = params.limit ?? 20
  const where: Record<string, unknown> = { isActive: true }

  if (params.types && params.types.length > 0) {
    where.type = { in: params.types }
  } else if (params.type) {
    where.type = params.type
  }

  if (params.difficulties && params.difficulties.length > 0) {
    where.difficulty = { in: params.difficulties }
  } else if (params.difficulty) {
    where.difficulty = params.difficulty
  }

  if (params.balance && params.types && params.types.length > 1) {
    const perType = Math.max(1, Math.floor(limit / params.types.length))
    const allQuestions = await Promise.all(
      params.types.map((t) => {
        const typeWhere: Record<string, unknown> = { isActive: true, type: t }
        if (params.difficulties && params.difficulties.length > 0) {
          typeWhere.difficulty = { in: params.difficulties }
        } else if (params.difficulty) {
          typeWhere.difficulty = params.difficulty
        }
        return quizRepo.findQuestions(typeWhere).then((qs) => shuffle(qs).slice(0, perType))
      }),
    )
    const questions = shuffle(allQuestions.flat())
    return { questions: questions.slice(0, limit), total: questions.length }
  }

  const questions = await quizRepo.findQuestions(where)
  const shuffled = shuffle(questions)

  return {
    questions: shuffled.slice(0, limit),
    total: questions.length,
  }
}

export async function getWeightedQuestions(
  userId: string,
  params: {
    types?: string[]
    difficulties?: string[]
    limit?: number
  },
) {
  const limit = params.limit ?? 20
  const allTypes = params.types ?? [
    'word-form',
    'comparison',
    'vocabulary',
    'verb-tense',
    'preposition',
    'conjunction',
    'participle',
    'voice',
    'relative-clause',
    'agreement',
  ]

  const stats = await quizRepo.findAllAttempts(userId)
  const typeMap = new Map<string, { total: number; correct: number }>()
  for (const a of stats) {
    const key = a.question.type
    const entry = typeMap.get(key) ?? { total: 0, correct: 0 }
    entry.total++
    if (a.isCorrect) entry.correct++
    typeMap.set(key, entry)
  }

  const weights: Record<string, number> = {}
  for (const type of allTypes) {
    const s = typeMap.get(type)
    if (!s || s.total === 0) {
      weights[type] = 0.5
    } else {
      weights[type] = 1 - s.correct / s.total
    }
  }

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  const normalized: Record<string, number> = {}
  for (const type of allTypes) {
    normalized[type] = totalWeight > 0 ? weights[type] / totalWeight : 1 / allTypes.length
  }

  const counts: Record<string, number> = {}
  let allocated = 0
  for (const type of allTypes) {
    const raw = limit * normalized[type]
    counts[type] = Math.floor(raw)
    allocated += counts[type]
  }

  let remainder = limit - allocated
  const sorted = [...allTypes].sort((a, b) => normalized[b] - normalized[a])
  for (const type of sorted) {
    if (remainder <= 0) break
    counts[type]++
    remainder--
  }

  const whereBase: Record<string, unknown> = { isActive: true }
  if (params.difficulties && params.difficulties.length > 0) {
    whereBase.difficulty = { in: params.difficulties }
  }

  const questions = (
    await Promise.all(
      allTypes.map(async (type) => {
        const count = counts[type]
        if (count <= 0) return []
        const typeWhere: Record<string, unknown> = { ...whereBase, type }
        const typeQuestions = await quizRepo.findQuestions(typeWhere)
        return shuffle(typeQuestions).slice(0, count)
      }),
    )
  ).flat()

  return { questions: shuffle(questions), total: questions.length }
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
