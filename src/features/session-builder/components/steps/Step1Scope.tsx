'use client'

import { PartGroup } from '@/features/session-builder/components/scope'
import { PART_GROUPS } from '@/features/session-builder/constants'
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
        <PartGroup
          title='Reading'
          parts={PART_GROUPS.reading}
          selectedParts={scope.parts}
          onToggle={handleToggle}
        />

        <PartGroup
          title='Listening'
          parts={PART_GROUPS.listening}
          selectedParts={[]}
          onToggle={() => {}}
          disabled
        />
      </div>

      <p className='text-xs text-muted-foreground text-center'>
        {scope.parts.length > 0
          ? `${scope.parts.length} part(s) selected`
          : 'Please select at least one part'}
      </p>
    </div>
  )
}
