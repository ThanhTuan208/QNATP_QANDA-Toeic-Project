'use client'

import { Eye, Play } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button/Button'
import { Label } from '@/components/common/Label'
import { StepHeader } from '@/components/common/StepHeader'
import { Switch } from '@/components/common/Switch/Switch'
import {
  LoadingState,
  QuestionItem,
  SessionSummary,
} from '@/features/session-builder/components/preview'
import type { PresetType } from '@/features/session-builder/types'
import type { SessionConfig, SessionQuestion } from '@/features/temp-session/types'

interface Step4PreviewProps {
  preset: PresetType
  config: Partial<SessionConfig>
  source: 'system' | 'imported'
  questions: SessionQuestion[]
  onBack: () => void
  onStart: () => void
  isGenerating?: boolean
  generationError?: string
}

export function Step4Preview({
  preset,
  config,
  source,
  questions,
  onBack,
  onStart,
  isGenerating = false,
  generationError = '',
}: Step4PreviewProps) {
  const total = config.totalQuestions ?? questions.length
  const [showAnswers, setShowAnswers] = useState(false)
  const [showCorrect, setShowCorrect] = useState(false)

  if (isGenerating || generationError) {
    return (
      <LoadingState isGenerating={isGenerating} generationError={generationError} onBack={onBack} />
    )
  }

  return (
    <div className='space-y-6'>
      <StepHeader
        title='Preview'
        description='Review your practice session before starting'
        icon={<Eye className='w-6 h-6' />}
      />

      <SessionSummary preset={preset} config={config} source={source} total={total} />

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-semibold text-foreground'>Questions ({questions.length})</h4>
          <div className='flex items-center gap-4'>
            <Label htmlFor='login-email' className='flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none'>
              <Switch checked={showAnswers} onCheckedChange={setShowAnswers} />
              Show Answers
            </Label>
            <Label className='flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none'>
              <Switch checked={showCorrect} onCheckedChange={setShowCorrect} />
              Show Correct
            </Label>
          </div>
        </div>
        {questions.map((q, i) => (
          <QuestionItem key={q.tempId} question={q} index={i} showAnswers={showAnswers} showCorrect={showCorrect} />
        ))}
      </div>

      <div className='flex gap-3'>
        <Button buttonType='outline' onClick={onBack}>
          Back
        </Button>
        <Button
          buttonType='fill'
          icon={<Play className='size-4' />}
          onClick={onStart}
          disabled={questions.length === 0}
        >
          Start Practice
        </Button>
      </div>
    </div>
  )
}
