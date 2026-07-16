'use client'

import { DIFFICULTIES, DIFFICULTY_LABELS } from '@/features/session-builder/constants'

interface DifficultySectionProps {
  difficulties: string[]
  onToggle: (diff: string) => void
}

export function DifficultySection({ difficulties, onToggle }: DifficultySectionProps) {
  return (
    <div className='pt-2'>
      <h4 className='text-xs sm:text-sm font-bold text-muted-foreground/80 uppercase tracking-widest mb-3'>
        Difficulty
      </h4>
      <div className='flex gap-2'>
        {DIFFICULTIES.map((diff) => {
          const isSelected = difficulties.includes(diff)
          return (
            <button
              key={diff}
              type='button'
              onClick={() => onToggle(diff)}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all duration-200 select-none cursor-pointer ${
                isSelected
                  ? 'border-green-teal bg-green-teal-5 text-green-teal shadow-sm shadow-green-teal/10 -translate-y-px'
                  : 'border-border bg-card text-muted-foreground hover:border-green-teal-20 hover:bg-green-teal-5/20 hover:text-green-teal active:scale-[0.98] transition-all duration-200'
              }`}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
