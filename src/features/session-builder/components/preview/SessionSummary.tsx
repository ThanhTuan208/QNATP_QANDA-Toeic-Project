'use client'

import { DIFFICULTY_LABELS } from '@/features/session-builder/constants/difficulty'
import { PART_LABELS } from '@/features/session-builder/constants/knowledge-groups'
import { PRESETS } from '@/features/session-builder/constants/presets-data'
import type { PresetType } from '@/features/session-builder/types'
import type { SessionConfig } from '@/features/temp-session/types'

interface SessionSummaryProps {
  preset: PresetType
  config: Partial<SessionConfig>
  source: 'system' | 'imported'
  total: number
}

export function SessionSummary({ preset, config, source, total }: SessionSummaryProps) {
  const presetInfo = PRESETS.find((p) => p.id === preset)
  const PresetIcon = presetInfo?.icon

  return (
    <div className='bg-card border border-border rounded-xl p-4 space-y-2'>
      <div className='flex items-center gap-2'>
        {PresetIcon && <PresetIcon className='size-4 text-muted-foreground' />}
        <span className='text-sm font-semibold text-foreground'>{presetInfo?.label ?? preset}</span>
        <span className='ml-auto text-xs text-muted-foreground'>
          {source === 'system' ? 'System Bank' : 'Practice Now'}
        </span>
      </div>
      <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
        <span>
          Parts:{' '}
          {config.parts
            ?.sort()
            .map((p) => PART_LABELS[p]?.replace('Part ', '') ?? p)
            .join(', ')}
        </span>
        <span>
          Difficulty:{' '}
          {Array.isArray(config.difficulty)
            ? config.difficulty.map((d) => DIFFICULTY_LABELS[d] ?? d).join(', ')
            : (DIFFICULTY_LABELS[config.difficulty ?? 'medium'] ?? 'Medium')}
        </span>
        <span>Total: {total} questions</span>
        <span>Est. time: ~{Math.ceil(total * 1.5)} min</span>
      </div>
    </div>
  )
}
