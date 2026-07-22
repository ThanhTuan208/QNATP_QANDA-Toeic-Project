'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  canGoBack: boolean
  canGoNext: boolean
  nextLabel?: string
  loading?: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  nextLabel = 'Next',
  loading = false,
}: StepNavigationProps) {
  return (
    <div className='flex items-center justify-between mt-4 pt-4 md:pt-6 border-t border-border'>
      <Button
        buttonType='outline'
        icon={<ArrowLeft className='h-3.5 sm:h-4 w-3.5 sm:w-4' />}
        onClick={onBack}
        disabled={!canGoBack}
        className='px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
      >
        Back
      </Button>

      <div className='flex items-center gap-1.5 sm:gap-2.5'>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepId = `step-dot-${String(i + 1)}`
          return (
            <div
              key={stepId}
              className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-colors ${
                i === currentStep
                  ? 'bg-green-teal dark:bg-pale-teal'
                  : i < currentStep
                    ? 'bg-green-teal/40 dark:bg-pale-teal/30'
                    : 'bg-muted-foreground/20 dark:bg-neutral-80/20'
              }`}
            />
          )
        })}
      </div>

      {onNext && (
        <Button
          icon={
            loading ? (
              <Loader2 className='h-3.5 sm:h-4 w-3.5 sm:w-4 animate-spin' />
            ) : (
              <ArrowRight className='h-3.5 sm:h-4 w-3.5 sm:w-4' />
            )
          }
          iconPosition='right'
          onClick={onNext}
          disabled={!canGoNext}
          className='px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
        >
          {loading ? 'Generating...' : nextLabel}
        </Button>
      )}
    </div>
  )
}
