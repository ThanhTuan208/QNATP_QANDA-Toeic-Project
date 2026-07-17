'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'

interface CompletionScreenProps {
  correctCount: number
  totalCount: number
  typeStats: Record<string, { correct: number; total: number }>
  onRetryIncorrect: () => void
  onBack: () => void
}

export function CompletionScreen({
  correctCount,
  totalCount,
  typeStats,
  onRetryIncorrect,
  onBack,
}: CompletionScreenProps) {
  return (
    <div className='space-y-5 sm:space-y-6'>
      <div className='text-center space-y-2'>
        <h3 className='text-xl sm:text-2xl font-bold text-foreground'>Practice Complete</h3>
        <p className='text-3xl sm:text-4xl font-bold text-primary'>
          {correctCount}/{totalCount}
        </p>
        <p className='text-xs sm:text-sm text-muted-foreground'>
          {totalCount > 0
            ? `Accuracy: ${Math.round((correctCount / totalCount) * 100)}%`
            : 'No questions answered'}
        </p>
      </div>

      {Object.entries(typeStats).length > 0 && (
        <div className='bg-card border border-border rounded-xl p-3 sm:p-4 space-y-2'>
          <h4 className='text-xs sm:text-sm font-semibold text-foreground'>Breakdown</h4>
          {Object.entries(typeStats).map(([type, stat]) => (
            <div key={type} className='flex items-center justify-between text-xs sm:text-sm'>
              <span className='text-muted-foreground'>{type}</span>
              <span className='font-medium text-foreground'>
                {stat.correct}/{stat.total}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
        <Button
          buttonType='fill'
          icon={<RefreshCw className='size-3.5 sm:size-4' />}
          onClick={onRetryIncorrect}
          className='w-full sm:w-auto text-xs sm:text-sm'
        >
          Retry Incorrect
        </Button>
        <Button
          buttonType='outline'
          onClick={onBack}
          className='w-full sm:w-auto text-xs sm:text-sm'
        >
          Back to Preview
        </Button>
      </div>
    </div>
  )
}
