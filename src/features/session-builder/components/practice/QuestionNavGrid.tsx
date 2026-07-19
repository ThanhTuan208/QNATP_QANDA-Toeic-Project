'use client'

import { useMemo } from 'react'
import type { Question } from '@/features/quiz/types'
import { cn } from '@/lib/utils'

interface QuestionNavGridProps {
  questions: Question[]
  currentIndex: number
  answered: Record<number, string>
  correctMap: Record<number, boolean>
  flagged: Set<number>
  onSelect: (index: number) => void
}

interface PartGroup {
  part: number
  startIndex: number
  endIndex: number
  count: number
}

export function QuestionNavGrid({
  questions,
  currentIndex,
  answered,
  correctMap,
  flagged,
  onSelect,
}: QuestionNavGridProps) {
  const groups = useMemo(() => {
    const map = new Map<number, PartGroup>()
    for (let i = 0; i < questions.length; i++) {
      const part = questions[i].part ?? 0
      const existing = map.get(part)
      if (existing) {
        existing.endIndex = i
        existing.count++
      } else {
        map.set(part, { part, startIndex: i, endIndex: i, count: 1 })
      }
    }
    return Array.from(map.values())
  }, [questions])

  const renderButton = (i: number) => {
    const isAnswered = answered[i] !== undefined
    const isCurrent = i === currentIndex
    const isFlagged = flagged.has(i)
    const isCorrect = isAnswered && correctMap[i]

    const bg = isCurrent
      ? 'bg-linear-to-br from-purple to-neutral-5 text-primary-foreground shadow-lg shadow-primary/30'
      : isAnswered && isCorrect
        ? 'bg-linear-to-br from-green-teal to-pale-light border-success'
        : isAnswered && !isCorrect
          ? 'bg-linear-to-br from-error-hover to-warning-foreground/80 border-error'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'

    return (
      <button
        type='button'
        key={i.toString()}
        onClick={() => onSelect(i)}
        className={cn(
          'relative w-full aspect-square rounded-md text-sm font-mono font-bold transition-all duration-200',
          bg,
        )}
      >
        {i + 1}
        {isFlagged && (
          <span className='absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-safety-orange border border-background' />
        )}
      </button>
    )
  }

  return (
    <div className='space-y-4'>
      {groups.map((group) => (
        <div key={group.part}>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60'>
              Part {group.part}
            </span>
            <div className='flex-1 h-px bg-border/40' />
            <span className='text-[10px] font-mono text-muted-foreground/40'>
              {group.count}
            </span>
          </div>
          <div className='grid gap-1.5' style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            {Array.from({ length: group.count }, (_, offset) => {
              const i = group.startIndex + offset
              return renderButton(i)
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
