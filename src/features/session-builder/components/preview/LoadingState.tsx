'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'

interface LoadingStateProps {
  isGenerating: boolean
  generationError?: string
  onBack?: () => void
}

export function LoadingState({ isGenerating, generationError, onBack }: LoadingStateProps) {
  if (isGenerating) {
    return (
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-bold text-foreground mb-1'>Generating Questions</h3>
          <p className='text-sm text-muted-foreground'>Fetching questions from System Bank...</p>
        </div>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='size-8 animate-spin text-primary' />
        </div>
      </div>
    )
  }

  if (generationError) {
    return (
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-bold text-foreground mb-1'>Generation Failed</h3>
          <p className='text-sm text-muted-foreground'>
            An error occurred while fetching questions
          </p>
        </div>
        <div className='bg-error-soft text-error rounded-xl p-4 text-sm border border-error/20'>
          {generationError}
        </div>
        {onBack && (
          <Button buttonType='outline' onClick={onBack}>
            Back
          </Button>
        )}
      </div>
    )
  }

  return null
}
