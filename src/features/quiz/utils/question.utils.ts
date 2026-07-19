import type { OptionStatus } from '@/features/quiz/types'

export function getOptionStatus(
  optId: string,
  selectedOptionId: string | null,
  correctOptionId: string | null,
  viewingOptionId?: string | null,
): OptionStatus {
  if (correctOptionId === null) {
    return selectedOptionId === optId ? 'selected' : 'idle'
  }
  if (optId === correctOptionId) return 'correct'
  if (optId === selectedOptionId && optId !== correctOptionId) return 'wrong'
  if (optId === viewingOptionId) return 'viewing'
  return 'disabled'
}
