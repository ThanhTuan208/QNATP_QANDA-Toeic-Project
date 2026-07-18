import { useState } from 'react'
import type { SessionAttempt, SessionQuestion } from '@/features/temp-session'
import { attemptRecordToSessionAttempt } from '../utils/questions'

export function useListPracticeView(
  questions: SessionQuestion[],
  onComplete: (attempts: SessionAttempt[]) => void,
) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const allAnswered = questions.every((q) => answers[q.tempId] != null)

  const handleSelect = (questionId: string, optionId: string) => {
    if (completed) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleComplete = () => {
    const attempts = questions
      .filter((q) => answers[q.tempId] != null)
      .map((q, i) => {
        const selected = q.options.find((o) => o.id === answers[q.tempId])
        return attemptRecordToSessionAttempt(
          {
            questionId: q.tempId,
            selectedOptionId: answers[q.tempId],
            isCorrect: selected?.id === q.correctOptionId,
          },
          i,
        )
      })
    setCompleted(true)
    onComplete(attempts)
  }
  return {
    answers,
    expanded,
    allAnswered,
    completed,
    setCompleted,
    setExpanded,
    handleSelect,
    handleComplete,
  }
}
