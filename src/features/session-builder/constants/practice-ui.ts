export const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export const OPTION_ACCENT_COLORS = ['#7c5cfc', '#00d4aa', '#fbbf24', '#f472b6'] as const

export const OPTION_ACCENT_COLORS_RGB = [
  '124,92,252',
  '0,212,170',
  '251,191,36',
  '244,114,182',
] as const

export const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  easy: {
    label: 'Easy',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
  hard: {
    label: 'Hard',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10 border-rose-400/20',
  },
}

export const PRACTICE_TIMER_DEFAULT = 12 * 60

export const GRADE_THRESHOLDS = [
  { min: 90, grade: 'S', color: '#fbbf24', label: 'Xuất sắc!' },
  { min: 75, grade: 'A', color: '#00d4aa', label: 'Tốt lắm!' },
  { min: 60, grade: 'B', color: '#7c5cfc', label: 'Khá tốt!' },
  { min: 45, grade: 'C', color: '#f472b6', label: 'Cố gắng hơn!' },
  { min: 0, grade: 'D', color: '#ff4d6d', label: 'Thử lại nhé!' },
] as const

export const TIMER_WARNING_SECONDS = 180
export const TIMER_URGENT_SECONDS = 60
