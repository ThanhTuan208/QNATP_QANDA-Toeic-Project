'use client'

import { CustomConfigForm } from '@/features/session-builder/components/CustomConfigForm'
import { PresetCards } from '@/features/session-builder/components/PresetCards'
import type { PresetType } from '@/features/session-builder/types'
import type { SessionConfig } from '@/features/temp-session/types'

interface Step2ConfigProps {
  parts: number[]
  preset: PresetType
  config: Partial<SessionConfig>
  onPresetChange: (preset: PresetType) => void
  onConfigChange: (config: Partial<SessionConfig>) => void
}

export function Step2Config({
  parts,
  preset,
  config,
  onPresetChange,
  onConfigChange,
}: Step2ConfigProps) {
  const isAutoPreset = preset !== 'custom'

  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-foreground'>How do you want to practice today?</h2>
        <p className='text-muted-foreground'>Choose a preset or build your own</p>
      </div>

      <PresetCards selected={preset} onSelect={onPresetChange} />

      {!isAutoPreset && (
        <CustomConfigForm parts={parts} config={config} onConfigChange={onConfigChange} />
      )}

      {isAutoPreset && config.totalQuestions != null && (
        <div className='text-center text-sm text-muted-foreground bg-muted/30 py-3 rounded-xl border border-border'>
          {config.totalQuestions} questions &middot;{' '}
          {Array.isArray(config.difficulty)
            ? config.difficulty.join(', ')
            : (config.difficulty ?? 'Mixed')}{' '}
          &middot; {parts.length} part(s)
        </div>
      )}
    </div>
  )
}
