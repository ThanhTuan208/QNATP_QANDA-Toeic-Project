'use client'

import { PART_LABELS } from '@/features/session-builder/constants'

interface PartGroupProps {
  title: string
  parts: number[]
  selectedParts: number[]
  onToggle: (part: number) => void
  disabled?: boolean
}

export function PartGroup({ title, parts, selectedParts, onToggle, disabled }: PartGroupProps) {
  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <h3 className='text-sm font-semibold text-foreground mb-3 uppercase tracking-wider'>
        {title}
      </h3>
      <div className='grid gap-3'>
        {parts.map((part) => {
          const selected = selectedParts.includes(part)
          return (
            <label
              key={part}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                disabled
                  ? 'border-border cursor-not-allowed bg-muted/30'
                  : selected
                    ? 'border-steel-blue bg-steel-blue-5 cursor-pointer'
                    : 'border-border hover:bg-muted/50 cursor-pointer'
              }`}
            >
              <input
                type='checkbox'
                checked={selected}
                onChange={() => onToggle(part)}
                disabled={disabled}
                className='accent-steel-blue w-4 h-4'
              />
              <span
                className={`text-sm font-medium ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}
              >
                {PART_LABELS[part]}
              </span>
              {disabled && (
                <span className='ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
                  Coming soon
                </span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
