'use client'

import { Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'

interface PresetCardProps {
  name: string
  part: number
  distribution: readonly { type: string; count: number }[]
  isSelected: boolean
  onSelect: () => void
  onDelete?: () => void
}

export function PresetCard({ name, part, distribution, isSelected, onSelect, onDelete }: PresetCardProps) {
  return (
    <div
      className={`p-3.5 rounded-xl border backdrop-blur-xs space-y-2.5 transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-green-teal bg-green-teal-5/20 dark:bg-green-teal-20/10 shadow-md shadow-green-teal-5/20'
          : 'border-green-teal-10 dark:border-neutral-80/10 bg-green-bright/20 dark:bg-card/40 hover:shadow-md hover:shadow-green-teal-5/10'
      }`}
      onClick={onSelect}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {isSelected && <Check className='size-4 text-green-teal' />}
          <span className='text-sm lg:text-base font-bold text-primary-teal dark:text-pale-light'>{name}</span>
        </div>
        <div className='flex gap-1.5 items-center'>
          <Button
            buttonType={isSelected ? 'ghost' : 'fill'}
            icon={isSelected ? <Check className='size-3' /> : undefined}
            className={`text-xs sm:text-sm h-6.5 px-3 rounded-md transition-all ${
              isSelected
                ? 'text-green-teal bg-green-teal-5 dark:bg-green-teal-20/10 border border-green-teal'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            {isSelected ? 'Đã chọn' : 'Chọn'}
          </Button>
          {onDelete && (
            <button
              type='button'
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onDelete()
              }}
              className='size-6.5 flex items-center justify-center rounded-md text-subtext-50 hover:text-destructive dark:hover:text-error-default bg-neutral-10 hover:bg-error-soft/20 dark:bg-neutral-80/10 transition-all'
            >
              <Trash2 className='size-3.5' />
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-1.5 bg-neutral-0/50 dark:bg-neutral-90/40 p-2 rounded-lg border border-green-teal-10/20'>
        {distribution.map((d) => {
          const label =
            getKnowledgeGroupsForPart(part).find((kg) => kg.type === d.type)?.label ?? d.type
          return (
            <span key={d.type} className='text-[10px] sm:text-xs text-subtext-90 dark:text-neutral-30 flex justify-between items-center pr-2'>
              <span className="opacity-80">{label}:</span>
              <strong className='text-primary-teal dark:text-pale-teal font-bold'>{d.count}</strong>
            </span>
          )
        })}
      </div>
    </div>
  )
}
