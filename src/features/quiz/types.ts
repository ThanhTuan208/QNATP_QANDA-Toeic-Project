export interface Option {
  id: string
  text: string
  order: number
}

export interface Question {
  id: string
  questionText: string
  type: string
  difficulty: string
  hint: string | null
  options: Option[]
}

export interface AttemptResult {
  isCorrect: boolean
  correctOptionId: string
  rationale: string
}

export interface SubmitAttemptResponse extends AttemptResult {
  attempt: { id: string }
}

export interface StatsData {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  typeStats: Record<string, { total: number; correct: number }>
  recentAttempts: Array<{
    id: string
    isCorrect: boolean
    createdAt: string
    question: { type: string; difficulty: string }
  }>
}

export interface FetchQuestionsParams {
  type?: string
  difficulty?: string
}

export interface FetchQuestionsResponse {
  questions: Question[]
  total: number
}

export interface UseQuizQuestionsOptions {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
}

export interface UseQuizQuestionsReturn {
  questions: Question[]
  currentQuestion: Question | null
  currentIdx: number
  totalQuestions: number
  isLoading: boolean
  isEmpty: boolean
  isComplete: boolean
  setQuestions: (questions: Question[]) => void
  advanceQuestion: () => void
  resetIdx: () => void
}

export type AttemptPhase = 'idle' | 'submitting' | 'answered'

export type QuizState = 'loading' | 'ready' | 'answered' | 'complete'

export type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled'

export type AttemptState = {
  phase: AttemptPhase
  selectedOptionId: string | null
  result: AttemptResult | null
  correctCount: number
}

export interface UseQuizAttemptOptions {
  currentQuestion: Question | null
  currentIdx: number
  onStatsUpdate?: (total: number, correct: number) => void
}

export interface UseQuizAttemptReturn {
  selectedOptionId: string | null
  submitting: boolean
  result: AttemptResult | null
  correctCount: number
  handleSelect: (optionId: string) => void
  clearAnswer: () => void
}
