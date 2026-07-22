'use client'

import { Clock } from 'lucide-react'
import {
  TIMER_URGENT_SECONDS,
  TIMER_WARNING_SECONDS,
} from '@/features/session-builder/constants/practice-ui'
import { formatTime } from '@/features/session-builder/utils/practice-ui'

interface TimerRingProps {
  timeLeft: number
  total: number
}

export function TimerRing({ timeLeft, total }: TimerRingProps) {
  const pct = timeLeft / total
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = circ * pct
  const urgent = timeLeft < TIMER_URGENT_SECONDS
  const warning = timeLeft < TIMER_WARNING_SECONDS
  const color = urgent
    ? 'var(--color-quiz-error)'
    : warning
      ? 'var(--color-option-c)'
      : 'var(--color-option-a)'

  return (
    <div className='relative flex items-center justify-center' style={{ width: 80, height: 80 }}>
      <svg
        width='80'
        height='80'
        style={{ transform: 'rotate(-90deg)' }}
        role='img'
        aria-label='Countdown timer'
      >
        <circle cx='40' cy='40' r={r} fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='5' />
        <circle
          cx='40'
          cy='40'
          r={r}
          fill='none'
          stroke={color}
          strokeWidth='5'
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap='round'
          style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
        />
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <Clock className='w-3 h-3 mb-0.5' style={{ color }} />
        <span
          className='font-mono text-xs font-bold'
          style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  )
}
