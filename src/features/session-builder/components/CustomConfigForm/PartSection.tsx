'use client'

import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'
import { GroupStepper } from './GroupStepper'

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

  return (
    <div className='p-4 rounded-xl border border-border/50 bg-muted/10 space-y-3'>
      <div className='flex items-center justify-between'>
        <h4 className='text-xs font-extrabold text-steel-blue tracking-widest uppercase'>
          Part {part}
        </h4>
        <span className='text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md'>
          {groups.length} Groups
        </span>
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
                  ? 'border-steel-blue/20 bg-steel-blue-5/10'
                  : 'border-transparent bg-muted/30'
              }`}
            >
              <span
                className={`text-sm min-w-0 truncate pr-2 transition-colors ${isPositive ? 'text-foreground font-medium' : 'text-foreground/80'}`}
              >
                {group.label}
              </span>

              <GroupStepper
                part={part}
                type={group.type}
                count={count}
                onDeltaChange={onDeltaChange}
                onCountChange={onCountChange}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
