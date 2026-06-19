import type { OptionStatus } from '../types'

export function getOptionStatus(
  optId: string,
  selectedOptionId: string | null,
  correctOptionId: string | null,
): OptionStatus {
  if (correctOptionId === null) {
    return selectedOptionId === optId ? 'selected' : 'idle'
  }
  if (optId === correctOptionId) return 'correct'
  if (optId === selectedOptionId && optId !== correctOptionId) return 'wrong'
  return 'disabled'
}
