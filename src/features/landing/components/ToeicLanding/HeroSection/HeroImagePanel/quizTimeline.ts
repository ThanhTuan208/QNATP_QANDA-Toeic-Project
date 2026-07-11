export type TimelineStep = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface TimelineEntry {
  step: TimelineStep
  duration: number
}

export const TIMELINE: TimelineEntry[] = [
  { step: 0, duration: 600 },
  { step: 1, duration: 1800 },
  { step: 2, duration: 400 },
  { step: 3, duration: 1200 },
  { step: 4, duration: 2500 },
  { step: 5, duration: 2500 },
  { step: 6, duration: 500 },
]
