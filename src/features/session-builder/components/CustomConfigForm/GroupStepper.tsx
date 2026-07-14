'use client'

import { Minus, Plus } from 'lucide-react'
import { useCallback } from 'react'

interface GroupStepperProps {
  part: number
  type: string
  count: number
  onDeltaChange: (part: number, type: string, delta: number) => void
  onCountChange: (part: number, type: string, value: string) => void
}

export function GroupStepper({
  part,
  type,
  count,
  onDeltaChange,
  onCountChange,
}: GroupStepperProps) {
  const isPositive = count > 0

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
      onCountChange(part, type, raw)
    },
    [part, type, onCountChange],
  )

  return (
    <div className='flex items-center gap-1.5 shrink-0'>
      <button
        type='button'
        onClick={() => onDeltaChange(part, type, -1)}
        disabled={count <= 0}
        className='w-7 h-7 rounded-md border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer'
      >
        <Minus className='w-3.5 h-3.5' />
      </button>

      <input
        type='text'
        inputMode='numeric'
        maxLength={2}
        value={count === 0 ? '' : count}
        placeholder='0'
        onChange={handleInput}
        className={`w-10 h-7 text-center text-sm font-bold tabular-nums rounded bg-transparent border border-transparent hover:border-border focus:border-steel-blue focus:bg-background focus:ring-1 focus:ring-steel-blue/20 outline-none transition-all ${isPositive ? 'text-steel-blue' : 'text-muted-foreground'}`}
      />

      <button
        type='button'
        onClick={() => onDeltaChange(part, type, 1)}
        className='w-7 h-7 rounded-md border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer'
      >
        <Plus className='w-3.5 h-3.5' />
      </button>
    </div>
  )
}
