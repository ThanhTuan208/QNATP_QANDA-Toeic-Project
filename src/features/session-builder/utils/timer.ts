import type { CSSProperties } from 'react'

export interface TimerState {
  timeLeft: number
  timeUp: boolean
  hasTimeLimit: boolean
  isUrgent: boolean
  isWarning: boolean
}

export function getTimerState(
  timeLeft: number,
  timeUp: boolean,
  hasTimeLimit: boolean,
  warningSeconds: number,
  urgentSeconds: number,
): TimerState {
  return {
    timeLeft,
    timeUp,
    hasTimeLimit,
    isUrgent: hasTimeLimit && !timeUp && timeLeft < urgentSeconds,
    isWarning: hasTimeLimit && !timeUp && timeLeft < warningSeconds && timeLeft >= urgentSeconds,
  }
}

export function formatTimerLabel(timeUp: boolean, hasTimeLimit: boolean, timeLeft: number): string {
  if (hasTimeLimit && timeUp) return 'Hết giờ'
  const m = Math.floor(timeLeft / 60)
  const s = timeLeft % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function getTimerStyles(state: TimerState): CSSProperties {
  const { timeUp, hasTimeLimit, isUrgent, isWarning } = state
  const isError = timeUp || isUrgent

  return {
    background: isError
      ? 'rgba(var(--color-quiz-error-rgb), 0.15)'
      : isWarning
        ? 'rgba(var(--color-option-c-rgb), 0.1)'
        : hasTimeLimit
          ? 'rgba(var(--color-muted-subtle-rgb), 0.05)'
          : 'rgba(var(--color-muted-subtle-rgb), 0.03)',
    color: isError
      ? 'var(--color-quiz-error)'
      : isWarning
        ? 'var(--color-option-c)'
        : 'var(--color-muted-subtle)',
    borderColor: isError
      ? 'rgba(var(--color-quiz-error-rgb), 0.3)'
      : isWarning
        ? 'rgba(var(--color-option-c-rgb), 0.2)'
        : hasTimeLimit
          ? 'rgba(var(--color-muted-subtle-rgb), 0.08)'
          : 'rgba(var(--color-muted-subtle-rgb), 0.06)',
  }
}
