'use client'

import { PRESETS } from '@/features/session-builder/constants'
import type { PresetType } from '@/features/session-builder/types'

interface PresetCardsProps {
  selected: PresetType
  onSelect: (preset: PresetType) => void
}

export function PresetCards({ selected, onSelect }: PresetCardsProps) {
  return (
    <div className='grid grid-cols-2 gap-3.5'>
      {PRESETS.map((p) => {
        const Icon = p.icon
        const isSelected = selected === p.id

        return (
          <button
            key={p.id}
            type='button'
            onClick={() => onSelect(p.id)}
            className={`group text-left p-3.5 rounded-xl border transition-all duration-200 select-none cursor-pointer flex flex-col justify-between h-30 ${
              isSelected
                ? 'border-steel-blue bg-steel-blue-5/30 shadow-sm shadow-steel-blue/5 translate-y-px'
                : 'border-border bg-card hover:border-border-hover hover:bg-muted/40 hover:translate-y-px active:scale-[0.99]'
            }`}
          >
            <div>
              <div className='flex items-center gap-2 mb-1.5'>
                <div
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-steel-blue text-white'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                  }`}
                >
                  <Icon className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                </div>
                <span
                  className={`text-sm font-bold truncate transition-colors ${
                    isSelected ? 'text-steel-blue' : 'text-foreground'
                  }`}
                >
                  {p.label}
                </span>
              </div>

              <p className='text-xs text-muted-foreground leading-snug line-clamp-2'>
                {p.description}
              </p>
            </div>

            <div className='flex items-center justify-between mt-2 pt-2 border-t border-border/30'>
              <span
                className={`text-[8px] md:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded transition-colors ${
                  isSelected
                    ? 'bg-steel-blue/10 text-steel-blue'
                    : 'bg-muted text-muted-foreground group-hover:bg-muted/70'
                }`}
              >
                {p.subtext}
              </span>

              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isSelected ? 'bg-steel-blue scale-100' : 'bg-transparent scale-0'
                }`}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
