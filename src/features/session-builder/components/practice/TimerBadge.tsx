'use client'

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTimerState, getTimerStyles, formatTimerLabel } from '@/features/session-builder/utils/timer'
import {
  TIMER_URGENT_SECONDS,
  TIMER_WARNING_SECONDS,
} from '@/features/session-builder/constants/practice-ui'

interface TimerBadgeProps {
  timeLeft: number
  timeUp: boolean
  hasTimeLimit: boolean
}

export function TimerBadge({ timeLeft, timeUp, hasTimeLimit }: TimerBadgeProps) {
  const timerState = getTimerState(timeLeft, timeUp, hasTimeLimit, TIMER_WARNING_SECONDS, TIMER_URGENT_SECONDS)
  const styles = getTimerStyles(timerState)

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-mono font-bold transition-all',
        timerState.isUrgent && 'animate-pulse',
      )}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: styles.background,
        color: styles.color,
        border: `1px solid ${styles.borderColor}`,
      }}
    >
      <Clock className='w-3.5 h-3.5' />
      <span>
        {formatTimerLabel(timeUp, hasTimeLimit, timeLeft)}
      </span>
      {!hasTimeLimit && (
        <span className='ml-0.5 text-[10px] opacity-50'>đã làm</span>
      )}
    </div>
  )
}
