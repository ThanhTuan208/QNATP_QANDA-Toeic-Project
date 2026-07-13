'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  canGoBack: boolean
  canGoNext: boolean
  nextLabel?: string
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  nextLabel = 'Next',
}: StepNavigationProps) {
  return (
    <div className='flex items-center justify-between pt-6 border-t border-border'>
      <Button
        buttonType='outline'
        icon={<ArrowLeft className='h-4 w-4' />}
        onClick={onBack}
        disabled={!canGoBack}
      >
        Back
      </Button>

      <div className='flex items-center gap-2'>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepId = `step-dot-${String(i + 1)}`
          return (
            <div
              key={stepId}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentStep
                  ? 'bg-steel-blue'
                  : i < currentStep
                    ? 'bg-steel-blue/40'
                    : 'bg-muted-foreground/20'
              }`}
            />
          )
        })}
      </div>

      {onNext && (
        <Button
          icon={<ArrowRight className='h-4 w-4' />}
          iconPosition='right'
          onClick={onNext}
          disabled={!canGoNext}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  )
}
