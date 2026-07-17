'use client'

import { PART_LABELS } from '@/features/session-builder/constants'

interface PartGroupProps {
  title: string
  parts: number[]
  selectedParts: number[]
  onToggle: (part: number) => void
  disabled?: boolean
}

export function PartGroup({ title, parts, selectedParts, onToggle, disabled }: PartGroupProps) {
  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <h3 className='text-sm font-semibold text-foreground mb-3 uppercase tracking-wider'>
        {title}
      </h3>
      <div className='grid gap-3'>
        {parts.map((part) => {
          const selected = selectedParts.includes(part)
          return (
            <label
              key={part}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                disabled
                  ? 'border-border cursor-not-allowed bg-muted/30'
                  : selected
                    ? 'border-green-teal bg-green-teal-5 shadow-sm shadow-green-teal/10 cursor-pointer'
                    : 'border-border hover:bg-muted/50 hover:border-green-teal-20 cursor-pointer transition-all duration-200'
              }`}
            >
              <span className='relative h-7 w-7 shrink-0 rounded-lg bg-green-teal-10 shadow-[inset_-1px_1px_4px_0px_#f0fffe,inset_1px_-1px_4px_0px_#00bdb0,-1px_2px_4px_0px_#00bdb0]'>
                <input
                  type='checkbox'
                  checked={selected}
                  onChange={() => onToggle(part)}
                  disabled={disabled}
                  className='peer absolute inset-0 z-10 opacity-0 w-full h-full cursor-pointer'
                />
                <span className='pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#ccfffc] shadow-[inset_-1px_1px_4px_0px_#f0fffe,inset_1px_-1px_4px_0px_#00bdb0,-1px_1px_2px_0px_#00bdb0] duration-200 peer-checked:shadow-[inset_1px_-1px_4px_0px_#f0fffe,inset_-1px_1px_4px_0px_#00bdb0]'></span>
                <svg
                  fill='#00756d'
                  viewBox='-3.2 -3.2 38.4 38.4'
                  xmlns='http://www.w3.org/2000/svg'
                  className='pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100'
                >
                  <path d='M5 16.577l2.194-2.195 5.486 5.484L24.804 7.743 27 9.937l-14.32 14.32z'></path>
                </svg>
                <svg
                  fill='#00756d'
                  viewBox='0 0 1024 1024'
                  xmlns='http://www.w3.org/2000/svg'
                  className='pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 peer-checked:opacity-0'
                >
                  <path d='M697.4 759.2l61.8-61.8L573.8 512l185.4-185.4-61.8-61.8L512 450.2 326.6 264.8l-61.8 61.8L450.2 512 264.8 697.4l61.8 61.8L512 573.8z'></path>
                </svg>
              </span>
              <span
                className={`text-sm font-medium ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}
              >
                {PART_LABELS[part]}
              </span>
              {disabled && (
                <span className='ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
                  Coming soon
                </span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
