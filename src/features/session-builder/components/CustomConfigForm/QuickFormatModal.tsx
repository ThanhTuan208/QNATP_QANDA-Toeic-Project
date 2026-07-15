'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog'
import { useQuickFormat } from '@/features/session-builder/hooks/useQuickFormat'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'
import { QuickFormatContent } from './QuickFormatContent'

interface QuickFormatModalProps {
  parts: number[]
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  onApply: (groups: KnowledgeGroupConfig[], part: number) => void
  onApplyAll?: (allGroups: Record<number, KnowledgeGroupConfig[]>) => void
  trigger: React.ReactNode
}

export function QuickFormatModal({ parts, knowledgeGroups, onApply, onApplyAll, trigger }: QuickFormatModalProps) {
  const [open, setOpen] = useState(false)

  const hook = useQuickFormat({ parts, knowledgeGroups, onApply, onApplyAll })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        size='sm'
        className='rounded-2xl border border-green-teal-10 dark:border-neutral-80/20 bg-background text-foreground shadow-2xl shadow-green-teal-20/20 dark:shadow-black/60 duration-700 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100'
      >
        <DialogHeader showDivider className="border-b border-green-teal-10 dark:border-neutral-80/20">
          <DialogTitle
            className="text-primary-teal dark:text-pale-light font-bold"
            subtitle='Chọn preset cho các part, sau đó áp dụng cùng lúc'
          >
            Định dạng nhanh
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col' style={{ height: '440px', maxHeight: '70vh' }}>
          <QuickFormatContent {...hook} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
