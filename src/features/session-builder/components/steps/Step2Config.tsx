'use client'

import { Settings2, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog'
import { StepHeader } from '@/components/common/StepHeader'
import { CustomConfigForm } from '@/features/session-builder/components/CustomConfigForm'
import { PresetCards } from '@/features/session-builder/components/PresetCards'
import type { PresetType } from '@/features/session-builder/types'
import type { SessionConfig } from '@/features/temp-session/types'

interface Step2ConfigProps {
  parts: number[]
  preset: PresetType
  config: Partial<SessionConfig>
  onPresetChange: (preset: PresetType) => void
  onConfigChange: (config: Partial<SessionConfig>) => void
}

export function Step2Config({
  parts,
  preset,
  config,
  onPresetChange,
  onConfigChange,
}: Step2ConfigProps) {
  const [open, setOpen] = useState(false)
  const showAutoPreset = preset != null && preset !== 'custom'

  return (
    <div className='space-y-6'>
      <StepHeader
        title='Bạn muốn luyện tập hôm nay như thế nào?'
        description='Chọn preset có sẵn hoặc tự cấu hình'
        icon={<SlidersHorizontal className='w-6 h-6 text-green-teal dark:text-pale-teal' />}
      />

      <PresetCards selected={preset} onSelect={onPresetChange} />

      {preset === 'custom' && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className='animate-in fade-in slide-in-from-bottom-2 duration-500'>
              <Button
                buttonType='fill'
                className='w-full h-11 bg-primary text-primary-foreground shadow-lg shadow-primary-teal/10 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary-teal/20 transition-all duration-300'
                icon={<Settings2 className='size-4' />}
              >
                Tùy chỉnh nâng cao
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent
            size='full'
            showCloseButton={false}
            className='max-h-[90vh] lg:max-w-5xl xl:max-w-6xl overflow-y-auto [&::-webkit-scrollbar]:hidden p-0 gap-0 rounded-2xl border border-green-teal-10 dark:border-neutral-80/20 bg-background text-foreground shadow-2xl shadow-green-teal-20/20 dark:shadow-neutral-100/40 duration-700 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-top-0'
          >
            <DialogHeader
              showDivider
              className='sticky top-0 bg-linear-to-r from-green-teal-80 via-green-teal-40 to-green-teal-default z-10 px-6 pt-6 pb-4 rounded-t-2xl'
            >
              <div className='flex items-start justify-between gap-4'>
                <DialogTitle
                  className='text-primary-teal dark:text-pale-light font-bold'
                  subtitle='Tùy chỉnh buổi luyện tập của bạn'
                >
                  Tùy chỉnh
                </DialogTitle>
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='mt-1 rounded-full p-1.5 text-green-dark dark:text-pale-light hover:bg-green-teal-10 dark:hover:bg-green-teal-20/50 hover:text-green-teal-default dark:hover:text-pale-teal transition-colors'
                >
                  <X className='size-5' />
                </button>
              </div>
            </DialogHeader>

            <div className='px-6 pb-6 pt-6 bg-green-bright/20 dark:bg-card/40 backdrop-blur-xs'>
              <CustomConfigForm parts={parts} config={config} onConfigChange={onConfigChange} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAutoPreset && config.totalQuestions != null && (
        <div className='text-center text-sm text-subtext-90 dark:text-neutral-30 bg-green-bright/50 dark:bg-neutral-90/50 py-3 rounded-xl border border-green-teal-10 dark:border-neutral-80/20 animate-in fade-in slide-in-from-bottom-2 duration-500'>
          <span className='font-medium text-green-teal dark:text-pale-teal'>
            {config.totalQuestions}
          </span>{' '}
          questions &middot;{' '}
          <span className='font-medium text-green-teal dark:text-pale-teal'>
            {Array.isArray(config.difficulty)
              ? config.difficulty.join(', ')
              : (config.difficulty ?? 'Mixed')}
          </span>{' '}
          &middot;{' '}
          <span className='font-medium text-green-teal dark:text-pale-teal'>{parts.length}</span>{' '}
          part(s)
        </div>
      )}
    </div>
  )
}
