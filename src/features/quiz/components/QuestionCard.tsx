'use client'

import { Part5QuestionCard } from '@/features/quiz/components/Part5QuestionCard'
import { Part6QuestionCard } from '@/features/quiz/components/Part6QuestionCard'
import { Part7QuestionCard } from '@/features/quiz/components/Part7QuestionCard'
import type { QuestionCardProps } from '@/features/quiz/types/question-card'

export function QuestionCard(props: QuestionCardProps) {
  const { question } = props

  if (question.part === 6) {
    return <Part6QuestionCard {...props} />
  }

  if (question.part === 7) {
    return <Part7QuestionCard {...props} />
  }

  return <Part5QuestionCard {...props} />
}
