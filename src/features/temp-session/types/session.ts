export interface SessionConfig {
  preset: 'quick' | 'balanced' | 'smart' | 'exam' | 'custom'
  parts: number[]
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  difficulty: string[]
  source: 'system' | 'imported'
  importJson?: string
  totalQuestions: number
  timeLimit?: number
}

export interface KnowledgeGroupConfig {
  type: string
  count: number
}

export interface ContentBlock {
  type: 'text' | 'blank' | 'image' | 'table'
  value?: string
  headers?: string[]
  rows?: string[][]
}

export interface SessionPassage {
  id: string
  title?: string
  content: string
  contentBlocks?: ContentBlock[]
  passageFormat?: string
  order?: number
}

export interface SessionQuestion {
  tempId: string
  part: number
  type: string
  difficulty: string
  questionText: string
  passageText?: string
  passage?: SessionPassage
  passages?: SessionPassage[]
  passageGroupId?: string
  passageId?: string
  options: {
    id: string
    text: string
    order: number
    isCorrect?: boolean
    rationale?: string
  }[]
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
