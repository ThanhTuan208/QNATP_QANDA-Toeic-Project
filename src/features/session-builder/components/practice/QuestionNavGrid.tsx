'use client'

import { cn } from '@/lib/utils'

interface QuestionNavGridProps {
  total: number
  currentIndex: number
  answered: Record<number, string>
  correctMap: Record<number, boolean>
  flagged: Set<number>
  onSelect: (index: number) => void
}

export function QuestionNavGrid({
  total,
  currentIndex,
  answered,
  correctMap,
  flagged,
  onSelect,
}: QuestionNavGridProps) {
  return (
    <div className='grid gap-1.5' style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {Array.from({ length: total }, (_, i) => {
        const isAnswered = answered[i] !== undefined
        const isCurrent = i === currentIndex
        const isFlagged = flagged.has(i)
        const isCorrect = isAnswered && correctMap[i]

        const bg = isCurrent
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
          : isAnswered && isCorrect
            ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
            : isAnswered && !isCorrect
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'

        return (
          <button
            type='button'
            key={i}
            onClick={() => onSelect(i)}
            className={cn(
              'relative w-full aspect-square rounded-lg text-xs font-mono font-bold transition-all duration-200',
              bg,
            )}
          >
            {i + 1}
            {isFlagged && (
              <span className='absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-background' />
            )}
          </button>
        )
      })}
    </div>
  )
}
