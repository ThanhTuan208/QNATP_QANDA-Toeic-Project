import type { Question, PassageInfo } from '@/features/quiz/types'
import type { SessionBuilderState } from '@/features/session-builder/types'
import { TTL_HOURS } from '@/features/temp-session/constants'
import type {
  PracticeSession,
  SessionAttempt,
  SessionQuestion,
} from '@/features/temp-session/types'

function generateTempId(): string {
  return `tmp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function buildTypeToPartMap(
  knowledgeGroups: Record<number, { type: string; count: number }[]>,
): Map<string, number> {
  const map = new Map<string, number>()
  for (const [partStr, groups] of Object.entries(knowledgeGroups)) {
    const part = Number(partStr)
    for (const group of groups) {
      if (!map.has(group.type)) {
        map.set(group.type, part)
      }
    }
  }
  return map
}

function mapDbOptionToSessionOption(o: {
  id: string; text: string; order: number; rationale?: string | null; isCorrect: boolean
}): SessionQuestion['options'][number] {
  return {
    id: o.id,
    text: o.text,
    order: o.order,
    rationale: o.rationale ?? '',
    isCorrect: o.isCorrect,
  }
}

interface DbPassageInfo {
  id: string
  title?: string | null
  content: string
  passageFormat?: string | null
  order?: number | null
  passageGroupId?: string | null
}

function mapDbPassageToSessionPassage(
  p: DbPassageInfo,
): SessionQuestion['passage'] {
  return {
    id: p.id,
    title: p.title ?? undefined,
    content: p.content,
    passageFormat: p.passageFormat?.toLowerCase(),
    order: p.order ?? undefined,
  }
}

export function dbQuestionToSessionQuestion(
  q: {
    id: string
    questionText: string
    passageText?: string | null
    type: string
    difficulty: string
    part?: number | null
    passage?: (DbPassageInfo) | null
    options: Array<{
      id: string; text: string; order: number; rationale?: string | null; isCorrect: boolean
    }>
  },
  typeToPart: Map<string, number>,
): SessionQuestion {
  const correctOption = q.options.find((o) => o.isCorrect)
  return {
    tempId: generateTempId(),
    part: typeToPart.get(q.type.toLowerCase()) ?? q.part ?? 5,
    type: q.type.toLowerCase(),
    difficulty: q.difficulty.toLowerCase(),
    questionText: q.questionText,
    passageText: q.passageText ?? undefined,
    passage: q.passage ? mapDbPassageToSessionPassage(q.passage) : undefined,
    passages: q.passage ? [mapDbPassageToSessionPassage(q.passage)!] : undefined,
    passageGroupId: q.passage?.passageGroupId ?? undefined,
    passageId: q.passage?.id ?? undefined,
    options: q.options.map(mapDbOptionToSessionOption),
    correctOptionId: correctOption?.id ?? '',
    rationale: correctOption?.rationale ?? '',
    originalId: q.id,
  }
}

export function dbQuestionsToSessionQuestions(
  questions: Parameters<typeof dbQuestionToSessionQuestion>[0][],
  typeToPart: Map<string, number>,
): SessionQuestion[] {
  return questions.map((q) => dbQuestionToSessionQuestion(q, typeToPart))
}

export function sessionQuestionToQuizQuestion(sq: SessionQuestion): Question {
  return {
    id: sq.tempId,
    questionText: sq.questionText,
    passageText: sq.passageText,
    passage: sq.passage,
    passages: sq.passages,
    type: sq.type,
    difficulty: sq.difficulty,
    hint: null,
    part: sq.part,
    passageGroupId: sq.passageGroupId,
    passageId: sq.passageId,
    options: sq.options.map((o) => ({
      id: o.id,
      text: o.text,
      order: o.order,
      rationale: o.rationale,
    })),
    correctOptionId: sq.correctOptionId,
    rationale: sq.rationale,
  }
}

export function sessionQuestionsToQuizQuestions(sqs: SessionQuestion[]): Question[] {
  return sqs.map(sessionQuestionToQuizQuestion)
}

export function buildPracticeSession(
  state: SessionBuilderState,
): Omit<PracticeSession, 'id' | 'userId'> {
  return {
    createdAt: Date.now(),
    expiresAt: Date.now() + TTL_HOURS * 60 * 60 * 1000,
    config: {
      preset: state.preset ?? 'quick',
      parts: state.scope.parts,
      knowledgeGroups: state.config.knowledgeGroups ?? {},
      difficulty: state.config.difficulty ?? ['medium'],
      source: state.source,
      importJson: state.importJson || undefined,
      totalQuestions: state.questions.length,
      timeLimit: state.config.timeLimit,
    },
    questions: state.questions,
    attempts: [],
    currentIndex: 0,
    status: 'active',
  }
}

export function attemptRecordToSessionAttempt(
  record: {
    questionId: string
    selectedOptionId: string
    isCorrect: boolean
  },
  index: number,
): SessionAttempt {
  return {
    tempQuestionId: record.questionId,
    selectedOptionId: record.selectedOptionId,
    isCorrect: record.isCorrect,
    timeSpentMs: 0,
    createdAt: Date.now() + index,
  }
}
