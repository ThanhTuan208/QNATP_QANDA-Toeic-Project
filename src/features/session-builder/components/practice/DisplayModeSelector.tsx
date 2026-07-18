'use client'

import { List, ListChecks } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/Dialog'
import { cn } from '@/lib/utils'

interface DisplayModeSelectorProps {
  open: boolean
  onConfirm: (mode: 'quiz' | 'list') => void
}

const modes = [
  {
    id: 'quiz' as const,
    label: 'Quiz Mode',
    description: 'Trả lời từng câu một, chuyển tiếp sau mỗi câu',
    icon: ListChecks,
  },
  {
    id: 'list' as const,
    label: 'List Mode',
    description: 'Xem tất cả câu hỏi cùng lúc, tự do chọn câu để trả lời',
    icon: List,
  },
]

export function DisplayModeSelector({ open, onConfirm }: DisplayModeSelectorProps) {
  const [selected, setSelected] = useState<'quiz' | 'list'>('quiz')

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent size='md' showCloseButton={false} className='rounded-2xl p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold text-center'>Chọn chế độ hiển thị</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-4 py-4'>
          {modes.map((mode) => {
            const Icon = mode.icon
            const isSelected = selected === mode.id
            return (
              <button
                key={mode.id}
                type='button'
                onClick={() => setSelected(mode.id)}
                className={cn(
                  'group p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-3',
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/15 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/30 hover:bg-primary/5',
                )}
              >
                <div
                  className={cn(
                    'p-3 rounded-xl transition-all',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className='size-6' />
                </div>
                <div className='space-y-1'>
                  <p
                    className={cn(
                      'text-sm font-extrabold',
                      isSelected ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {mode.label}
                  </p>
                  <p className='text-[11px] text-muted-foreground leading-relaxed'>
                    {mode.description}
                  </p>
                </div>
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center',
                    isSelected ? 'border-primary' : 'border-muted-foreground/40',
                  )}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full bg-primary transition-all',
                      isSelected ? 'scale-100' : 'scale-0',
                    )}
                  />
                </div>
              </button>
            )
          })}
        </div>
        <Button
          buttonType='fill'
          className='w-full h-11 text-sm font-bold'
          onClick={() => onConfirm(selected)}
        >
          Bắt đầu
        </Button>
      </DialogContent>
    </Dialog>
  )
}
