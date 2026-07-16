import type { Question } from '@/features/quiz/types'
import type { SessionBuilderState } from '@/features/session-builder/types'
import { TTL_HOURS } from '@/features/temp-session/constants'
import type {
  PracticeSession,
  SessionAttempt,
  SessionQuestion,
} from '@/features/temp-session/types'

export function sessionQuestionToQuizQuestion(sq: SessionQuestion): Question {
  return {
    id: sq.tempId,
    questionText: sq.questionText,
    type: sq.type,
    difficulty: sq.difficulty,
    hint: null,
    options: sq.options.map((o) => ({
      id: o.id,
      text: o.text,
      order: o.order,
    })),
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
