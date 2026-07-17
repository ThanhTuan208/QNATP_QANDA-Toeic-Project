'use client'

import { Clock } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select'
import { TIME_LIMIT_OPTIONS } from '@/features/session-builder/constants/part-timing'

interface Props {
  config: { timeLimit?: number }
  onConfigChange?: (config: any) => void
}

export function TimeLimitSelect({ config, onConfigChange }: Props) {
  const currentValue = config.timeLimit != null ? String(config.timeLimit) : 'no-limit'

  const handleValueChange = (value: string) => {
    onConfigChange?.({
      ...config,
      timeLimit: value === 'no-limit' ? undefined : Number(value),
    })
  }

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger
        className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 h-7 sm:h-8 w-fit min-w-0 sm:min-w-[130px] rounded-xl border border-green-teal-10/40 dark:border-neutral-80/10 bg-green-bright/10 dark:bg-neutral-90/20 hover:border-green-teal-20 dark:hover:border-neutral-80/30 text-[10px] sm:text-xs font-bold text-primary-teal dark:text-pale-light focus:ring-1 focus:ring-green-teal-10 dark:focus:ring-pale-teal/20 focus:ring-offset-0 transition-all duration-300 group'
        icon={
          <Clock className='size-3 sm:size-3.5 text-green-teal dark:text-pale-teal shrink-0 transition-transform duration-300 group-hover:scale-105' />
        }
      >
        <SelectValue placeholder='No limit' />
      </SelectTrigger>

      <SelectContent className='rounded-xl border border-green-teal-10 dark:border-neutral-80/20 bg-background/95 backdrop-blur-md text-foreground shadow-xl shadow-green-teal-10/5 dark:shadow-black/40 min-w-[140px] p-1 z-50 duration-200'>
        <SelectItem
          value='no-limit'
          className='text-xs font-semibold rounded-lg text-subtext-90 dark:text-neutral-30 focus:bg-green-bright/20 dark:focus:bg-neutral-80/10 focus:text-primary-teal dark:focus:text-pale-teal cursor-pointer transition-colors duration-200'
        >
          No limit
        </SelectItem>

        {TIME_LIMIT_OPTIONS.map((m) => (
          <SelectItem
            key={m}
            value={String(m)}
            className='text-xs font-semibold rounded-lg text-subtext-90 dark:text-neutral-30 focus:bg-green-bright/20 dark:focus:bg-neutral-80/10 focus:text-primary-teal dark:focus:text-pale-teal cursor-pointer transition-colors duration-200'
          >
            {m} min
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
