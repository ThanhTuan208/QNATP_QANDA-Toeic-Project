export interface SessionConfig {
  preset: 'quick' | 'balanced' | 'smart' | 'exam' | 'custom'
  parts: number[]
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  difficulty: string[]
  source: 'system' | 'imported'
  importJson?: string
  totalQuestions: number
}

export interface KnowledgeGroupConfig {
  type: string
  count: number
}

export interface SessionQuestion {
  tempId: string
  part: number
  type: string
  difficulty: string
  questionText: string
  options: { id: string; text: string; order: number; isCorrect?: boolean }[]
  correctOptionId: string
  rationale: string
  originalId?: string
}

export interface SessionAttempt {
  tempQuestionId: string
  selectedOptionId: string
  isCorrect: boolean
  timeSpentMs: number
  createdAt: number
}

export interface PracticeSession {
  id: string
  userId: string
  createdAt: number
  expiresAt: number
  config: SessionConfig
  questions: SessionQuestion[]
  attempts: SessionAttempt[]
  currentIndex: number
  status: 'preview' | 'active' | 'paused' | 'completed'
}
