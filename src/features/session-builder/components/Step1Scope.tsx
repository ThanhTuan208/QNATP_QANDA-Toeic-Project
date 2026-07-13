'use client'

import { PART_GROUPS, PART_LABELS } from '@/features/session-builder/constants'
import type { ScopeConfig } from '@/features/session-builder/types'
import { togglePartSelection } from '@/features/session-builder/utils/knowledge-groups'

interface Step1ScopeProps {
  scope: ScopeConfig
  onScopeChange: (scope: ScopeConfig) => void
}

export function Step1Scope({ scope, onScopeChange }: Step1ScopeProps) {
  const handleToggle = (part: number) => {
    onScopeChange({ parts: togglePartSelection(scope.parts, part) })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-foreground'>Select Parts</h2>
        <p className='text-muted-foreground'>Choose which TOEIC parts you want to practice</p>
      </div>

      <div className='space-y-4'>
        <div>
          <h3 className='text-sm font-semibold text-foreground mb-3 uppercase tracking-wider'>
            Reading
          </h3>
          <div className='grid gap-2'>
            {PART_GROUPS.reading.map((part) => {
              const selected = scope.parts.includes(part)
              return (
                <label
                  key={part}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    selected
                      ? 'border-steel-blue bg-steel-blue-5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type='checkbox'
                    checked={selected}
                    onChange={() => handleToggle(part)}
                    className='accent-steel-blue w-4 h-4'
                  />
                  <span className='text-sm font-medium text-foreground'>{PART_LABELS[part]}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className='opacity-50 pointer-events-none'>
          <h3 className='text-sm font-semibold text-foreground mb-3 uppercase tracking-wider'>
            Listening
          </h3>
          <div className='grid gap-2'>
            {PART_GROUPS.listening.map((part) => (
              <label
                key={part}
                className='flex items-center gap-3 px-4 py-3 rounded-xl border border-border cursor-not-allowed bg-muted/30'
              >
                <input type='checkbox' disabled className='accent-steel-blue w-4 h-4' />
                <span className='text-sm text-muted-foreground'>{PART_LABELS[part]}</span>
                <span className='ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
                  Coming soon
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <p className='text-xs text-muted-foreground text-center'>
        {scope.parts.length > 0
          ? `${scope.parts.length} part(s) selected`
          : 'Please select at least one part'}
      </p>
    </div>
  )
}
