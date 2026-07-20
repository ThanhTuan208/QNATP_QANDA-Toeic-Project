'use client'

import { Flag } from 'lucide-react'

interface FlagButtonProps {
  flagged: boolean
  onToggle: () => void
}

export function FlagButton({ flagged, onToggle }: FlagButtonProps) {
  return (
    <button
      type='button'
      onClick={onToggle}
      title='Đánh dấu câu này'
      className='shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110'
      style={{
        background: flagged ? 'rgba(var(--color-option-c-rgb), 0.15)' : 'transparent',
        border: `1px solid ${flagged ? 'rgba(var(--color-option-c-rgb), 0.4)' : 'transparent'}`,
      }}
    >
      <Flag
        className='w-3.5 h-3.5'
        style={{
          color: flagged ? 'var(--color-option-c)' : 'var(--color-muted-subtle)',
          fill: flagged ? 'var(--color-option-c)' : 'none',
        }}
      />
    </button>
  )
}
