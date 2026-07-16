export const PART_TIME_PER_QUESTION: Record<number, number> = {
  1: 30,
  2: 20,
  3: 45,
  4: 45,
  5: 30,
  6: 40,
  7: 70,
}

export const DEFAULT_TIME_PER_QUESTION = 50

export const TIME_LIMIT_OPTIONS = Array.from({ length: 24 }, (_, i) => (i + 1) * 5)
