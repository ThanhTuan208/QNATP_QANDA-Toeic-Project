'use client'

import { useCustomConfig } from '@/features/session-builder/hooks/useCustomConfig'
import type { SessionConfig } from '@/features/temp-session/types'
import { DifficultySection } from './DifficultySection'
import { PartSection } from './PartSection'
import { QuickFormat } from './QuickFormat'
import { TotalBanner } from './TotalBanner'

interface CustomConfigFormProps {
  parts: number[]
  config: Partial<SessionConfig>
  onConfigChange: (config: Partial<SessionConfig>) => void
}

export function CustomConfigForm({ parts, config, onConfigChange }: CustomConfigFormProps) {
  const {
    knowledgeGroups,
    difficulties,
    total,
    handleDeltaChange,
    handleCountChange,
    applyPreset,
    handleDifficultyToggle,
  } = useCustomConfig(config, onConfigChange)

  return (
    <div className='space-y-6 bg-card p-5 sm:p-6 rounded-2xl border border-border/80 shadow-sm'>
      <div className='flex items-center justify-between pb-3 border-b border-border/40'>
        <div className='flex items-center gap-2'>
          <div className='w-1.5 h-4 rounded bg-steel-blue' />
          <h3 className='font-bold text-foreground text-base'>Custom Configuration</h3>
        </div>
        <QuickFormat parts={parts} knowledgeGroups={knowledgeGroups} onApply={applyPreset} />
      </div>

      <div className='space-y-5'>
        {parts.map((part) => (
          <PartSection
            key={part}
            part={part}
            knowledgeGroups={knowledgeGroups}
            onDeltaChange={handleDeltaChange}
            onCountChange={handleCountChange}
          />
        ))}
      </div>

      <DifficultySection difficulties={difficulties} onToggle={handleDifficultyToggle} />
      <TotalBanner total={total} />
    </div>
  )
}
