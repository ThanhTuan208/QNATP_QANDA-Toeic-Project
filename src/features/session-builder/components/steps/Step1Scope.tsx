'use client'

import { AlertTriangle, CheckCircle, ClipboardList } from 'lucide-react'
import { StepHeader } from '@/components/common/StepHeader'
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

  const hasSelected = scope.parts.length > 0

  return (
    <div className='max-w-3xl mx-auto space-y-8 lg:py-2'>
      <StepHeader
        title='Select Parts'
        description='Choose which TOEIC parts you want to practice in this session'
        icon={<ClipboardList className='w-6 h-6' />}
      />

      <div className='grid md:grid-cols-2 gap-8 items-start'>
        <PartGroup
          title='Listening'
          parts={PART_GROUPS.listening}
          selectedParts={[]}
          onToggle={() => {}}
          disabled
        />

        <PartGroup
          title='Reading'
          parts={PART_GROUPS.reading}
          selectedParts={scope.parts}
          onToggle={handleToggle}
        />
      </div>

      <div className='pt-4 border-t border-border/50'>
        <div
          className={`flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 ${
            hasSelected ? 'text-steel-blue' : 'text-destructive animate-pulse'
          }`}
        >
          {hasSelected ? (
            <>
              <CheckCircle className='w-4 h-4' />
              <span>{scope.parts.length} part(s) selected</span>
            </>
          ) : (
            <>
              <AlertTriangle className='w-4 h-4' />
              <span>Please select at least one part to continue</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
