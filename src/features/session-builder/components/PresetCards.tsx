'use client'

import { PRESETS } from '@/features/session-builder/constants'
import type { PresetType } from '@/features/session-builder/types'

interface PresetCardsProps {
  selected: PresetType
  onSelect: (preset: PresetType) => void
}

export function PresetCards({ selected, onSelect }: PresetCardsProps) {
  return (
    <div className='grid grid-cols-2 gap-3'>
      {PRESETS.map((p) => {
        const Icon = p.icon
        const isSelected = selected === p.id
        return (
          <button
            key={p.id}
            type='button'
            onClick={() => onSelect(p.id)}
            className={`text-left p-4 rounded-xl border transition-colors ${
              isSelected
                ? 'border-steel-blue bg-steel-blue-5 ring-2 ring-steel-blue/20'
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <div className='flex items-center gap-3 mb-2'>
              <div
                className={`p-2 rounded-lg ${
                  isSelected ? 'bg-steel-blue text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className='h-5 w-5' />
              </div>
              <span className='font-semibold text-foreground'>{p.label}</span>
            </div>
            <p className='text-sm text-muted-foreground'>{p.description}</p>
            <p className='text-xs text-muted-foreground/70 mt-1'>{p.subtext}</p>
          </button>
        )
      })}
    </div>
  )
}
