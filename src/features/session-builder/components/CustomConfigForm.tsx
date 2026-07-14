'use client'

import { useMemo } from 'react'
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
} from '@/features/session-builder/constants'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'
import {
  calculateTotalQuestions,
  toggleDifficulty as computeDifficulty,
  updateKnowledgeGroupCount,
} from '@/features/session-builder/utils/presets'
import type { SessionConfig } from '@/features/temp-session/types'

interface CustomConfigFormProps {
  parts: number[]
  config: Partial<SessionConfig>
  onConfigChange: (config: Partial<SessionConfig>) => void
}

export function CustomConfigForm({ parts, config, onConfigChange }: CustomConfigFormProps) {
  const knowledgeGroups = config.knowledgeGroups ?? {}
  const difficulties = config.difficulty ?? [DEFAULT_DIFFICULTY]

  const handleGroupChange = (part: number, type: string, delta: number) => {
    const { groups, total } = updateKnowledgeGroupCount(knowledgeGroups, part, type, delta)
    onConfigChange({ ...config, knowledgeGroups: groups, totalQuestions: total })
  }

  const handleDifficultyToggle = (diff: string) => {
    const updated = computeDifficulty(difficulties, diff)
    onConfigChange({ ...config, difficulty: updated })
  }

  const total = useMemo(() => calculateTotalQuestions(knowledgeGroups), [knowledgeGroups])

  return (
    <div className='space-y-6 bg-card p-6 rounded-2xl border border-border'>
      <h3 className='font-semibold text-foreground'>Custom Configuration</h3>

      {parts.map((part) => {
        const groups = getKnowledgeGroupsForPart(part)
        if (groups.length === 0) return null

        return (
          <div key={part} className='space-y-3 pb-4 border-b border-border last:border-b-0'>
            <h4 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
              Part {part}
            </h4>
            <div className='grid gap-2'>
              {groups.map((group) => {
                const kgConfig = (knowledgeGroups[part] ?? []).find((g) => g.type === group.type)
                const count = kgConfig?.count ?? 0
                return (
                  <div
                    key={group.type}
                    className='flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30'
                  >
                    <span className='text-sm text-foreground'>{group.label}</span>
                    <div className='flex items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => handleGroupChange(part, group.type, -1)}
                        disabled={count <= 0}
                        className='w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
                      >
                        −
                      </button>
                      <span className='w-8 text-center text-sm font-medium tabular-nums text-foreground'>
                        {count}
                      </span>
                      <button
                        type='button'
                        onClick={() => handleGroupChange(part, group.type, 1)}
                        className='w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors'
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div>
        <h4 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
          Difficulty
        </h4>
        <div className='flex gap-2'>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type='button'
              onClick={() => handleDifficultyToggle(diff)}
              className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                difficulties.includes(diff)
                  ? 'border-steel-blue bg-steel-blue-5 text-steel-blue'
                  : 'border-border text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>
      </div>

      <div className='text-center text-sm font-semibold text-foreground bg-muted py-3 rounded-xl'>
        Total: {total} questions
      </div>
    </div>
  )
}
