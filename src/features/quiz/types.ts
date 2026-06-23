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

export type QuizState = 'loading' | 'ready' | 'answered' | 'complete'

export type OptionStatus = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled'
