'use client'

import { Save } from 'lucide-react'
import { Button } from '@/components/common/Button'

interface SavePresetFormProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

export function SavePresetForm({ value, onChange, onSave }: SavePresetFormProps) {
  return (
    <div className='flex gap-2 items-center bg-green-bright/10 dark:bg-neutral-90/20 p-1.5 rounded-xl border border-green-teal-10/30 dark:border-neutral-80/10'>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Tên preset...'
        className='flex-1 h-8 px-3 text-xs sm:text-sm rounded-lg border border-green-teal-10 dark:border-neutral-80/20 bg-background text-foreground placeholder:text-subtext-50 dark:placeholder:text-neutral-40 outline-none focus:border-green-teal focus:ring-1 focus:ring-green-teal-10 dark:focus:ring-pale-teal/20 transition-all duration-200'
      />
      <Button
        buttonType='fill'
        icon={<Save className='size-3' />}
        className='text-xs sm:text-sm h-8 px-3.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm disabled:opacity-50'
        disabled={!value.trim()}
        onClick={onSave}
      >
        Lưu preset
      </Button>
    </div>
  )
}