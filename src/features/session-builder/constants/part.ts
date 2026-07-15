export const PART = {
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
  P5: 5,
  P6: 6,
  P7: 7,
} as const

export type Part = (typeof PART)[keyof typeof PART]
