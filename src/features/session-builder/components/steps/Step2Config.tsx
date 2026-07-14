'use client'

import { Settings2, SlidersHorizontal } from 'lucide-react'
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
        title='How do you want to practice today?'
        description='Choose a preset or build your own'
        icon={<SlidersHorizontal className='w-6 h-6' />}
      />

      <PresetCards selected={preset} onSelect={onPresetChange} />

      {preset === 'custom' && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className='animate-in fade-in slide-in-from-bottom-2 duration-500'>
              <Button
                buttonType='fill'
                className='w-full h-11 bg-primary shadow-lg shadow-steel-blue/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-steel-blue/30 transition-all duration-300'
                icon={<Settings2 className='size-4' />}
              >
                Custom Configuration
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent
            size='full'
            className='max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden p-0 gap-0 duration-700 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-top-0'
          >
            <DialogHeader
              showDivider
              className='sticky top-0 bg-card z-10 px-6 pt-6 pb-4 rounded-t-2xl'
            >
              <DialogTitle subtitle='Customize your practice session'>
                Custom Configuration
              </DialogTitle>
            </DialogHeader>
            <div className='px-6 pb-6'>
              <CustomConfigForm parts={parts} config={config} onConfigChange={onConfigChange} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAutoPreset && config.totalQuestions != null && (
        <div className='text-center text-sm text-muted-foreground bg-muted/30 py-3 rounded-xl border border-border animate-in fade-in slide-in-from-bottom-2 duration-500'>
          {config.totalQuestions} questions &middot;{' '}
          {Array.isArray(config.difficulty)
            ? config.difficulty.join(', ')
            : (config.difficulty ?? 'Mixed')}{' '}
          &middot; {parts.length} part(s)
        </div>
      )}
    </div>
  )
}
