'use client'

import { TYPE_LABEL_MAP_VIETNAM } from '@/constants/index.constants'
import type { TypeStats } from '@/features/quiz/types'

interface ResultBreakdownProps {
  typeStats: TypeStats
}

const TYPE_ORDER = [
  'comparison',
  'word-form',
  'verb-tense',
  'preposition',
  'conjunction',
  'participle',
  'voice',
  'relative-clause',
  'agreement',
]

function TypeRow({ label, total, correct }: { label: string; total: number; correct: number }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  return (
    <div className='flex items-center gap-2 sm:gap-4'>
      <span className='w-20 sm:w-28 text-xs sm:text-sm font-medium text-foreground shrink-0'>{label}</span>
      <div className='flex-1 h-2 sm:h-3 bg-neutral-5 rounded-full overflow-hidden'>
        <div className='h-full bg-green rounded-full transition-all' style={{ width: `${pct}%` }} />
      </div>
      <span className='w-14 sm:w-16 text-right text-[10px] sm:text-sm text-muted-foreground shrink-0'>
        {correct}/{total}
      </span>
      <span className='w-8 sm:w-10 text-right text-[10px] sm:text-sm font-semibold text-foreground shrink-0'>{pct}%</span>
    </div>
  )
}

export function ResultBreakdown({ typeStats }: ResultBreakdownProps) {
  const entries = TYPE_ORDER.filter((key) => typeStats[key] && typeStats[key].total > 0).map(
    (key) => ({
      key,
      label: TYPE_LABEL_MAP_VIETNAM[key] ?? key,
      total: typeStats[key].total,
      correct: typeStats[key].correct,
    }),
  )

  if (entries.length === 0) return null

  return (
    <div className='space-y-3 p-4 sm:p-6 bg-card rounded-2xl border border-border'>
      <h3 className='text-xs sm:text-sm font-semibold text-foreground'>Kết quả theo chủ điểm</h3>
      <div className='space-y-2.5'>
        {entries.map((e) => (
          <TypeRow key={e.key} label={e.label} total={e.total} correct={e.correct} />
        ))}
      </div>
    </div>
  )
}
