'use client'

import { Clock, RotateCcw } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'
import { formatTime, getGradeInfo } from '@/features/session-builder/utils/practice-ui'

interface CompletionScreenProps {
  correctCount: number
  totalCount: number
  typeStats: Record<string, { correct: number; total: number }>
  timeTaken?: number
  onRetryIncorrect: () => void
  onBack: () => void
}

export function CompletionScreen({
  correctCount,
  totalCount,
  typeStats,
  timeTaken,
  onRetryIncorrect,
  onBack,
}: CompletionScreenProps) {
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  const { grade, label, color } = getGradeInfo(pct)
  const wrong = totalCount - correctCount

  return (
    <div className='flex items-center justify-center py-8'>
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div
          className='absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-[0.08] dark:opacity-[0.15]'
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className='relative max-w-xl w-full space-y-6 text-center'>
        {/* Grade ring */}
        <div className='flex flex-col items-center'>
          <div className='relative mb-4' style={{ width: 140, height: 140 }}>
            <svg
              width='140'
              height='140'
              style={{ transform: 'rotate(-90deg)' }}
              role='img'
              aria-label='Score percentage'
            >
              <circle
                cx='70'
                cy='70'
                r='58'
                fill='none'
                stroke='rgba(255,255,255,0.06)'
                strokeWidth='8'
              />
              <circle
                cx='70'
                cy='70'
                r='58'
                fill='none'
                stroke={color}
                strokeWidth='8'
                strokeDasharray={`${(2 * Math.PI * 58 * pct) / 100} ${2 * Math.PI * 58}`}
                strokeLinecap='round'
                style={{ transition: 'stroke-dasharray 1.5s ease' }}
              />
            </svg>
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <span
                className='text-5xl font-black leading-none'
                style={{ color, fontFamily: "'Sora', sans-serif" }}
              >
                {grade}
              </span>
              <span className='text-sm font-mono font-bold mt-1' style={{ color }}>
                {pct}%
              </span>
            </div>
          </div>
          <h2
            className='text-xl font-bold'
            style={{ fontFamily: "'Sora', sans-serif", color: 'var(--color-near-white)' }}
          >
            {label}
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Điểm: {correctCount}/{totalCount}
          </p>
        </div>

        {/* Stats row */}
        <div className='grid grid-cols-3 gap-3'>
          {[
            { label: 'Đúng', value: correctCount, color: 'var(--color-option-b)' },
            { label: 'Sai', value: wrong, color: 'var(--color-quiz-error)' },
            { label: 'Tổng', value: totalCount, color: 'var(--color-muted-subtle)' },
          ].map(({ label: lbl, value, color: clr }) => (
            <div
              key={lbl}
              className='rounded-xl p-4 text-center'
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className='text-2xl font-bold'
                style={{ fontFamily: "'JetBrains Mono', monospace", color: clr }}
              >
                {value}
              </div>
              <div className='text-xs text-muted-foreground mt-0.5'>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Type breakdown */}
        {Object.entries(typeStats).length > 0 && (
          <div
            className='rounded-xl p-4 text-left'
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <h4 className='text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3'>
              Phân tích theo loại
            </h4>
            <div className='space-y-2'>
              {Object.entries(typeStats).map(([type, stat]) => (
                <div key={type} className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>{type}</span>
                  <span className='font-medium text-foreground'>
                    {stat.correct}/{stat.total}
                    <span className='text-muted-foreground ml-1'>
                      ({stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time taken */}
        {timeTaken != null && (
          <div
            className='rounded-xl p-4 flex items-center justify-between'
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className='flex items-center gap-3'>
              <Clock className='w-4 h-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>Thời gian làm bài</span>
            </div>
            <span
              className='font-mono font-bold text-foreground'
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {formatTime(timeTaken)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3 pt-2'>
          <Button
            buttonType='fill'
            icon={<RotateCcw className='size-3.5 sm:size-4' />}
            onClick={onRetryIncorrect}
            className='w-full text-xs sm:text-sm'
          >
            Làm lại câu sai
          </Button>
          <Button buttonType='outline' onClick={onBack} className='w-full text-xs sm:text-sm'>
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  )
}
