'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'
import { PART_MAX_QUESTIONS } from '@/features/session-builder/constants'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'
import { GroupStepper } from './GroupStepper'

const MIN_QUESTIONS = 5

interface PartSectionProps {
  part: number
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  onDeltaChange: (part: number, type: string, delta: number) => void
  onCountChange: (part: number, type: string, value: string) => void
}

export function PartSection({
  part,
  knowledgeGroups,
  onDeltaChange,
  onCountChange,
}: PartSectionProps) {
  const groups = getKnowledgeGroupsForPart(part)
  if (groups.length === 0) return null

  const partMax = PART_MAX_QUESTIONS[part] ?? 99
  const partTotal = (knowledgeGroups[part] ?? []).reduce((s, g) => s + g.count, 0)
  const underMin = partTotal > 0 && partTotal < MIN_QUESTIONS
  const remaining = partMax - partTotal

  return (
    <div
      className={`p-4 rounded-xl border space-y-3 transition-colors ${
        underMin ? 'border-warning-foreground bg-warning-soft/40' : 'border-border/50 bg-muted/10'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h4 className='text-xs sm:text-sm font-extrabold text-steel-blue tracking-widest uppercase'>
            Part {part}
          </h4>
          {underMin && (
            <span className='flex items-center gap-1 text-[10px] font-semibold text-warning-foreground bg-warning-soft px-1.5 py-0.5 rounded-md'>
              <AlertTriangle className='size-3' />
              Min {MIN_QUESTIONS}
            </span>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <span
            className={`text-[10px] font-semibold tabular-nums ${
              remaining === 0 ? 'text-warning-foreground' : 'text-muted-foreground'
            }`}
          >
            {partTotal}/{partMax}
          </span>
          <span className='text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md'>
            {groups.length} nhóm
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        {groups.map((group) => {
          const kgConfig = (knowledgeGroups[part] ?? []).find((g) => g.type === group.type)
          const count = kgConfig?.count ?? 0
          const isPositive = count > 0

          return (
            <div
              key={group.type}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-150 ${
                isPositive
                  ? 'border-steel-blue/20 bg-steel-blue-5'
                  : 'border-transparent bg-muted/30'
              }`}
            >
              <span
                className={`text-sm lg:text-base min-w-0 truncate pr-2 transition-colors ${isPositive ? 'text-foreground font-medium' : 'text-foreground/80'}`}
              >
                {group.label}
              </span>

              <div className='flex items-center gap-1'>
                <GroupStepper
                  part={part}
                  type={group.type}
                  count={count}
                  onDeltaChange={onDeltaChange}
                  onCountChange={onCountChange}
                />
                {count > 0 && (
                  <button
                    type='button'
                    onClick={() => onDeltaChange(part, group.type, -count)}
                    className='size-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive dark:hover:text-error-default hover:bg-error-soft/20 dark:hover:bg-error-soft/10 transition-all'
                    title='Clear'
                  >
                    <RotateCcw className='size-3' />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
