import type { ContentBlock } from '@/features/temp-session/types'

export interface QuestionCardOption {
  id: string
  text: string
  order: number
  rationale?: string
}

export interface QuestionCardPassage {
  id?: string
  title?: string
  content: string
  contentBlocks?: ContentBlock[]
  passageFormat?: string
}

export interface QuestionCardQuestion {
  id: string
  questionText: string
  passageText?: string
  passage?: QuestionCardPassage
  passages?: QuestionCardPassage[]
  type: string
  part?: number
  hint?: string | null
  options: QuestionCardOption[]
  passageGroupId?: string
  passageId?: string
}

export interface QuestionCardProps {
  question: QuestionCardQuestion
  selectedOptionId: string | null
  correctOptionId: string | null
  onSelect: (optionId: string) => void
  disabled?: boolean
  headerLeft?: React.ReactNode
  headerRight?: React.ReactNode
  showFlag?: boolean
  isFlagged?: boolean
  onToggleFlag?: () => void
  questionNumber?: number
}
