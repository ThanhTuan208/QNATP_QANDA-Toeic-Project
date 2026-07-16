import {
  DEFAULT_TIME_PER_QUESTION,
  PART_TIME_PER_QUESTION,
} from '@/features/session-builder/constants/part-timing'

export function estimateTime(byPart: Record<number, number>): number {
  let totalSeconds = 0
  for (const [part, count] of Object.entries(byPart)) {
    const seconds = PART_TIME_PER_QUESTION[Number(part)] ?? DEFAULT_TIME_PER_QUESTION
    totalSeconds += seconds * count
  }
  return Math.ceil(totalSeconds / 60)
}
